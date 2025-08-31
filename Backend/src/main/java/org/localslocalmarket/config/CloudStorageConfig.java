package org.localslocalmarket.config;

import java.io.ByteArrayInputStream;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Configuration
public class CloudStorageConfig {

    @Value("${llm.gcs.enabled:false}")
    private boolean gcsEnabled;

    @Value("${llm.gcs.credentials-json:}")
    private String credentialsJson;

    @Bean
    public Storage storage() throws IOException {
        if (!gcsEnabled) {
            // Return a mock storage when GCS is disabled
            return StorageOptions.getDefaultInstance().getService();
        }

        // Use environment variable for credentials if provided
        if (credentialsJson != null && !credentialsJson.trim().isEmpty()) {
            // Use raw JSON directly from environment variable
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                new ByteArrayInputStream(credentialsJson.getBytes(java.nio.charset.StandardCharsets.UTF_8))
            );
            
            return StorageOptions.newBuilder()
                    .setCredentials(credentials)
                    .build()
                    .getService();
        } else {
            // Fall back to default credentials (service account, etc.)
            return StorageOptions.getDefaultInstance().getService();
        }
    }
}
