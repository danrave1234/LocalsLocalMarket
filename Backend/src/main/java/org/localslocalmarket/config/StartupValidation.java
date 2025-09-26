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
        // Log warning instead of failing for now during Cloud Run deployment
        // TODO: Set proper environment variables in Cloud Run
        if (jwtSecret == null || jwtSecret.contains("change-this-secret")) {
            System.err.println("WARNING: LLM_JWT_SECRET is not set to a secure value. Please set this environment variable in production.");
            // Don't fail during startup to allow deployment to complete
                        throw new IllegalStateException("LLM_JWT_SECRET must be set to a secure value in production environments");
        }
    }
}


