package org.localslocalmarket.config;

import org.localslocalmarket.security.XssSanitizationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FilterConfig {

    @Bean
    public FilterRegistrationBean<XssSanitizationFilter> xssFilterRegistration() {
        FilterRegistrationBean<XssSanitizationFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(new XssSanitizationFilter());
        registration.setOrder(1); // run early
        registration.addUrlPatterns("/*");
        registration.setName("xssSanitizationFilter");
        return registration;
    }
}


