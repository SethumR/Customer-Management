package com.example.customermanagement.service;

import com.example.customermanagement.dto.BulkUploadResponse;
import com.example.customermanagement.dto.CustomerDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CustomerService {
    CustomerDTO createCustomer(CustomerDTO customerDTO);
    CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO);
    CustomerDTO getCustomer(Long id);
    List<CustomerDTO> getAllCustomers();
    void deleteCustomer(Long id);
    BulkUploadResponse bulkUploadCustomers(MultipartFile file);
}