package org.localslocalmarket.service;

import java.io.IOException;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;

@Service
public class CloudStorageService {

    @Value("${llm.gcs.bucket-name:localslocalmarket.com}")
    private String bucketName;

    @Value("${llm.gcs.enabled:false}")
    private boolean gcsEnabled;

    private final Storage storage;

    public CloudStorageService(Storage storage) {
        this.storage = storage;
    }

    /**
     * Upload a file to a specific folder in GCS
     * @param file The file to upload
     * @param folder The folder path (e.g., "shops", "products", "users")
     * @return The public URL of the uploaded file
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String filename = UUID.randomUUID().toString() + extension;
        
        // Create the full path with folder
        String fullPath = folder + "/" + filename;

        // Create blob info
        BlobId blobId = BlobId.of(bucketName, fullPath);
        BlobInfo blobInfo = BlobInfo.newBuilder(blobId)
                .setContentType(file.getContentType())
                .build();

        // Upload file
        storage.create(blobInfo, file.getBytes());

        // Return public URL
        return String.format("https://storage.googleapis.com/%s/%s", bucketName, fullPath);
    }

    /**
     * Upload a file to the root of the bucket (backward compatibility)
     */
    public String uploadFile(MultipartFile file) throws IOException {
        return uploadFile(file, "general");
    }

    /**
     * Delete a file from GCS
     * @param filePath The full path to the file (including folder)
     */
    public void deleteFile(String filePath) {
        BlobId blobId = BlobId.of(bucketName, filePath);
        storage.delete(blobId);
    }

    /**
     * Delete a file by extracting the path from a full URL
     * @param fullUrl The full GCS URL
     */
    public void deleteFileByUrl(String fullUrl) {
        // Extract path from URL like: https://storage.googleapis.com/bucket-name/folder/filename.jpg
        String prefix = "https://storage.googleapis.com/" + bucketName + "/";
        if (fullUrl.startsWith(prefix)) {
            String filePath = fullUrl.substring(prefix.length());
            deleteFile(filePath);
        } else {
            throw new IllegalArgumentException("Invalid GCS URL format: " + fullUrl);
        }
    }

    public boolean isEnabled() {
        return gcsEnabled;
    }
}
