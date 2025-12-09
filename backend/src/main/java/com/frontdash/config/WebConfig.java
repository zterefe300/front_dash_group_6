package com.frontdash.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Serve files from the upload directory at /uploads/** URL path
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:" + Paths.get("upload").toAbsolutePath() + "/");
    }
}
