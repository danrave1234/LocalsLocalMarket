package org.localslocalmarket.config;

import org.localslocalmarket.security.SanitizingStringDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilder jacksonBuilder() {
        Jackson2ObjectMapperBuilder builder = new Jackson2ObjectMapperBuilder();

        // Sanitize all incoming Strings
        SimpleModule sanitizeModule = new SimpleModule();
        sanitizeModule.addDeserializer(String.class, new SanitizingStringDeserializer());

        // Support Java 8 date/time types (Instant, LocalDateTime, etc.)
        JavaTimeModule javaTimeModule = new JavaTimeModule();

        builder.modules(sanitizeModule, javaTimeModule);
        builder.featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        return builder;
    }
}


