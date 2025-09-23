package org.localslocalmarket.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("!dev")
public class StartupValidation implements ApplicationRunner {

    @Value("${llm.jwt.secret:change-this-secret-in-prod-please-32b-min}")
    private String jwtSecret;

    @Override
    public void run(ApplicationArguments args) {
        // Fail fast if secrets are left at defaults in non-dev profiles
        if (jwtSecret == null || jwtSecret.contains("change-this-secret")) {
            throw new IllegalStateException("LLM_JWT_SECRET must be set to a secure value in production environments");
        }
    }
}



