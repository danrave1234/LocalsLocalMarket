package org.localslocalmarket.security;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdScalarDeserializer;

/**
 * Jackson deserializer that sanitizes all incoming JSON String values
 * to mitigate XSS payloads and control characters.
 */
public class SanitizingStringDeserializer extends StdScalarDeserializer<String> {

    public SanitizingStringDeserializer() {
        super(String.class);
    }

    @Override
    public String deserialize(JsonParser p, DeserializationContext ctxt) throws IOException {
        String value = p.getValueAsString();
        return sanitize(value);
    }

    private String sanitize(String input) {
        if (input == null) return null;
        String cleaned = input;
        cleaned = cleaned.replaceAll("\\u0000", "").replaceAll("[\\p{Cntrl}]", "");
        cleaned = cleaned.replaceAll("(?i)<\\s*script[^>]*>([\\s\\S]*?)<\\s*/\\s*script>", "");
        cleaned = cleaned.replaceAll("(?i)on[a-z]+\\s*=", "");
        cleaned = cleaned.replaceAll("(?i)javascript:", "");
        cleaned = cleaned.replaceAll("(?i)vbscript:", "");
        cleaned = cleaned.replaceAll("<!--([\\s\\S]*?)-->", "");
        cleaned = cleaned.replaceAll("\\s{2,}", " ").trim();
        return cleaned;
    }
}


