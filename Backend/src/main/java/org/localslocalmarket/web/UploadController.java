package org.localslocalmarket.web;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

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
        
        // Simple approach: just save the original file with a new name
        String originalExt = StringUtils.getFilenameExtension(file.getOriginalFilename());
        String name = UUID.randomUUID() + "." + originalExt;
        Path dest = uploadRoot.resolve(name);
        
        try {
            // Copy the file directly without processing
            Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
            String rel = "/uploads/" + name;
            return ResponseEntity.ok(Map.of("path", rel));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to save image: " + e.getMessage()));
        }
    }
}
