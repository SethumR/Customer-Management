package com.example.customermanagement.dto;

import lombok.Data;

@Data
public class BulkUploadResponse {
    private int totalRecords;
    private int successCount;
    private int failureCount;
    private String message;
}