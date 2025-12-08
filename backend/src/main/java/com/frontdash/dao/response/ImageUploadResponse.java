package com.frontdash.dao.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ImageUploadResponse {
    private String filename;
    private String url;
    private String message;
}
