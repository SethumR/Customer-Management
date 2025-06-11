package com.example.customermanagement.dto;

import lombok.Data;

@Data
public class AddressDTO {
    private String addressLine1;
    private String addressLine2;
    private Long cityId;
    private Long countryId;
}