package org.localslocalmarket.security;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Simple XSS sanitization filter that strips common dangerous patterns
 * from request parameters and headers. This is a defense-in-depth layer;
 * React escapes output and repositories use parameterized queries, but
 * we still normalize inputs here.
 */
public class XssSanitizationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        filterChain.doFilter(new SanitizedHttpServletRequest(request), response);
    }

    private static class SanitizedHttpServletRequest extends HttpServletRequestWrapper {
        SanitizedHttpServletRequest(HttpServletRequest request) {
            super(request);
        }

        @Override
        public String getParameter(String name) {
            String value = super.getParameter(name);
            return sanitize(value);
        }

        @Override
        public String[] getParameterValues(String name) {
            String[] values = super.getParameterValues(name);
            if (values == null) return null;
            String[] sanitized = new String[values.length];
            for (int i = 0; i < values.length; i++) {
                sanitized[i] = sanitize(values[i]);
            }
            return sanitized;
        }

        @Override
        public Map<String, String[]> getParameterMap() {
            Map<String, String[]> original = super.getParameterMap();
            Map<String, String[]> result = new HashMap<>(original.size());
            for (Map.Entry<String, String[]> entry : original.entrySet()) {
                String[] values = entry.getValue();
                String[] sanitized = new String[values.length];
                for (int i = 0; i < values.length; i++) {
                    sanitized[i] = sanitize(values[i]);
                }
                result.put(entry.getKey(), sanitized);
            }
            return result;
        }

        @Override
        public String getHeader(String name) {
            String value = super.getHeader(name);
            return sanitize(value);
        }

        private String sanitize(String input) {
            if (input == null) return null;
            String cleaned = input;
            // Remove null characters and control chars
            cleaned = cleaned.replaceAll("\\u0000", "").replaceAll("[\\p{Cntrl}]", "");
            // Neutralize common script patterns
            cleaned = cleaned.replaceAll("(?i)<\\s*script[^>]*>([\\s\\S]*?)<\\s*/\\s*script>", "");
            cleaned = cleaned.replaceAll("(?i)on[a-z]+\\s*=", "");
            cleaned = cleaned.replaceAll("(?i)javascript:", "");
            cleaned = cleaned.replaceAll("(?i)data:text/html", "");
            cleaned = cleaned.replaceAll("(?i)vbscript:", "");
            // Remove HTML comments which can hide payloads
            cleaned = cleaned.replaceAll("<!--([\\s\\S]*?)-->", "");
            // Collapse excessive whitespace
            cleaned = cleaned.replaceAll("\\s{2,}", " ").trim();
            return cleaned;
        }
    }
}


