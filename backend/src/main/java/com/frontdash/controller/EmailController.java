package com.frontdash.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.frontdash.dao.request.EmailRequest;
import com.frontdash.service.EmailService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/email")
@Tag(name = "Email", description = "APIs for sending emails")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @PostMapping("/send")
    @Operation(summary = "Send email", description = "Send an email to a recipient with a specific message type")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Email sent successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request",
                    content = @Content(schema = @Schema(implementation = String.class)))
    })
    public ResponseEntity<String> sendEmail(@RequestBody EmailRequest request) {
        try {
            emailService.sendEmail(request.getRecipientEmail(), request.getMessageType());
            return ResponseEntity.ok("Email sent successfully");
        } catch (Exception e) {

            System.out.println(e);
            return ResponseEntity.badRequest().body("Failed to send email: " + e.getMessage());
        }
    }
}
