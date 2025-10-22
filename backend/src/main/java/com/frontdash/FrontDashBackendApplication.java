package com.frontdash;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@OpenAPIDefinition(
        info = @Info(
                title = "Dashboard Backend API",
                version = "1.0.0",
                description = "REST API for Dashboard application with MySQL and Hibernate"
        )
)
public class FrontDashBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(FrontDashBackendApplication.class, args);
    }
}
