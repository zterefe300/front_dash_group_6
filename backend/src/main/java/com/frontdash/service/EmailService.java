package com.frontdash.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.frontdash.dao.MessageType;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, MessageType messageType) {
        sendEmail(to, getBody(messageType), messageType);
    }

    public void sendEmail(String to, String bodyMessage, MessageType messageType) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(getSubject(messageType));
        message.setText(bodyMessage);

        mailSender.send(message);
    }

    public String generateStaffCredentialsBody(String username, String password) {
        return String.format(
            "Your staff account has been created successfully.\n\n" +
            "Login Credentials:\n" +
            "Username: %s\n" +
            "Password: %s\n\n" +
            "Please use these credentials to log in to the FrontDash system. " +
            "For security reasons, please change your password after first login.",
            username, password
        );
    }

    public String generateRestaurantCredentialsBody(String username, String password) {
        return String.format(
            "Your restaurant account has been created successfully.\n\n" +
            "Login Credentials:\n" +
            "Username: %s\n" +
            "Password: %s\n\n" +
            "Please use these credentials to log in to the FrontDash system and start managing your restaurant operations. " +
            "For security reasons, please change your password after first login.",
            username, password
        );
    }

    private String getSubject(MessageType messageType) {
        switch (messageType) {
            case RESTAURANT_REGISTRATION_APPROVAL:
                return "Restaurant Registration Approved";
            case RESTAURANT_APPROVAL_REJECTION:
                return "Restaurant Registration Rejected";
            case RESTAURANT_WITHDRAWAL_APPROVAL:
                return "Restaurant Withdrawal Approved";
            case RESTAURANT_WITHDRAWAL_REJECTION:
                return "Restaurant Withdrawal Rejected";
            case RESTAURANT_WITHDRAWAL_REQUEST:
                return "Restaurant Withdrawal Request Received";
            case RESTAURANT_REGISTRATION_SUBMITTED:
                return "Restaurant Registration Submitted Successfully";
            case STAFF_ACCOUNT_CREDENTIALS_SHARING:
                return "Your Staff Account Credentials";
            case RESTAURANT_ACCOUNT_CREATION_CREDENTIALS_SHARING:
                return "Your Restaurant Account Credentials";
            default:
                return "FrontDash Notification";
        }
    }

    private String getBody(MessageType messageType) {
        switch (messageType) {
            case RESTAURANT_REGISTRATION_APPROVAL:
                return "Congratulations! Your restaurant registration has been approved. You can now start using FrontDash to manage your restaurant operations.";
            case RESTAURANT_APPROVAL_REJECTION:
                return "We regret to inform you that your restaurant registration has been rejected. Please contact support for more information.";
            case RESTAURANT_WITHDRAWAL_APPROVAL:
                return "Your restaurant withdrawal request has been approved.";
            case RESTAURANT_WITHDRAWAL_REJECTION:
                return "Your restaurant withdrawal request has been rejected.";
            case RESTAURANT_WITHDRAWAL_REQUEST:
                return "We have received your restaurant withdrawal request. Our team will review it and contact you shortly.";
            case RESTAURANT_REGISTRATION_SUBMITTED:
                return "Thank you for submitting your restaurant registration request. Our team will review your application and contact you shortly.";
            default:
                return "This is a notification from FrontDash.";
        }
    }
}
