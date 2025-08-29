package org.localslocalmarket.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestPart;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.awt.image.BufferedImage;
import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.nio.file.*;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final Path uploadRoot;
    private final String outputFormat; // e.g., webp, png, jpg
    private final float outputQuality; // 0..1 for lossy encoders
    private final boolean webpLossless;

    public UploadController(@Value("${llm.uploads.dir}") String dir,
                            @Value("${llm.uploads.image.format}") String outputFormat,
                            @Value("${llm.uploads.image.quality}") float outputQuality,
                            @Value("${llm.uploads.webp.lossless}") boolean webpLossless) throws IOException {
        this.uploadRoot = Paths.get(dir).toAbsolutePath();
        this.outputFormat = (outputFormat == null || outputFormat.isBlank()) ? "webp" : outputFormat.toLowerCase();
        this.outputQuality = outputQuality;
        this.webpLossless = webpLossless;
        Files.createDirectories(uploadRoot);
    }

    @PostMapping(path = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file) throws IOException {
        if(file.isEmpty()) return ResponseEntity.badRequest().body(Map.of("error", "Empty file"));
        String ext = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String lower = ext==null? "" : ext.toLowerCase();
        if(!(lower.equals("jpg") || lower.equals("jpeg") || lower.equals("png") || lower.equals("webp"))){
            return ResponseEntity.badRequest().body(Map.of("error", "Only jpg/jpeg/png/webp allowed"));
        }
        if(file.getSize() > 2_000_000){
            return ResponseEntity.badRequest().body(Map.of("error", "Max 2MB"));
        }
        // Normalize output according to configuration (default webp)
        String outExt = outputFormat;
        String name = UUID.randomUUID()+"."+outExt;
        Path dest = uploadRoot.resolve(name);

        try(InputStream in = file.getInputStream()){
            BufferedImage img = ImageIO.read(in);
            if(img == null){
                return ResponseEntity.badRequest().body(Map.of("error", "Unsupported or corrupt image"));
            }

            String format = outExt;
            Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName(format);
            if(!writers.hasNext()){
                // Fallback: write PNG if desired format not available
                format = "png";
                outExt = "png";
                name = UUID.randomUUID()+"."+outExt;
                dest = uploadRoot.resolve(name);
            }

            Iterator<ImageWriter> actualWriters = ImageIO.getImageWritersByFormatName(format);
            if(!actualWriters.hasNext()){
                // As a last resort, just copy original bytes
                Path rawDest = uploadRoot.resolve(UUID.randomUUID()+"."+StringUtils.getFilenameExtension(file.getOriginalFilename()));
                Files.copy(file.getInputStream(), rawDest, StandardCopyOption.REPLACE_EXISTING);
                String relRaw = "/uploads/"+rawDest.getFileName().toString();
                return ResponseEntity.ok(Map.of("path", relRaw));
            }

            ImageWriter writer = actualWriters.next();
            try (OutputStream os = Files.newOutputStream(dest, StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                 ImageOutputStream ios = ImageIO.createImageOutputStream(os)){
                writer.setOutput(ios);
                ImageWriteParam param = writer.getDefaultWriteParam();

                if(param.canWriteCompressed()){
                    param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
                    // For WebP, optionally set lossless if supported
                    String[] types = param.getCompressionTypes();
                    if(types != null && types.length > 0){
                        if("webp".equalsIgnoreCase(format) && webpLossless){
                            for(String t : types){
                                if("Lossless".equalsIgnoreCase(t)){
                                    param.setCompressionType(t);
                                    break;
                                }
                            }
                        } else {
                            // Prefer a lossy type if there are multiple compression types
                            for(String t : types){
                                if(!"Lossless".equalsIgnoreCase(t)){
                                    param.setCompressionType(t);
                                    break;
                                }
                            }
                        }
                    }
                    // Quality 0..1, safe default is 0.95 (visually lossless for photos)
                    try { param.setCompressionQuality(Math.max(0f, Math.min(1f, outputQuality))); } catch (Exception ignored) {}
                }
                writer.write(null, new IIOImage(img, null, null), param);
                writer.dispose();
            }
        }
        String rel = "/uploads/"+name;
        return ResponseEntity.ok(Map.of("path", rel));
    }
}
