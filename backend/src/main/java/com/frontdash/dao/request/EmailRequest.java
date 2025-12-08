package com.frontdash.dao.request;

import com.frontdash.dao.MessageType;

import lombok.Data;

@Data
public class EmailRequest {
    private String recipientEmail;
    private MessageType messageType;
}
