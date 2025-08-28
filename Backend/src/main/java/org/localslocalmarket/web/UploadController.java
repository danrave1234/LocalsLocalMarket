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
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    private final Path uploadRoot;

    public UploadController(@Value("${llm.uploads.dir}") String dir) throws IOException {
        this.uploadRoot = Paths.get(dir).toAbsolutePath();
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
        String name = UUID.randomUUID()+"."+lower;
        Path dest = uploadRoot.resolve(name);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        String rel = "/uploads/"+name;
        return ResponseEntity.ok(Map.of("path", rel));
    }
}
