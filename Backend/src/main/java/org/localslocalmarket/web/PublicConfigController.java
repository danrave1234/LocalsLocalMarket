package org.localslocalmarket.web;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/config")
public class PublicConfigController {

    @Value("${llm.google.client-id:}")
    private String googleClientId;

    @GetMapping
    public ResponseEntity<?> getConfig() {
        return ResponseEntity.ok(Map.of(
            "googleClientId", googleClientId == null ? "" : googleClientId
        ));
    }
}


