package com.example.customermanagement.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
public class CustomerDTO {
    private Long id;
    private String name;
    private LocalDate dateOfBirth;
    private String nic;
    private List<String> mobileNumbers = new ArrayList<>();
    private List<AddressDTO> addresses = new ArrayList<>();
    private List<Long> familyMemberIds = new ArrayList<>();
}