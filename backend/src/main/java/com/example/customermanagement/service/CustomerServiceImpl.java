package com.example.customermanagement.service;

import com.example.customermanagement.dto.*;
import com.example.customermanagement.exception.ResourceNotFoundException;
import com.example.customermanagement.exception.DuplicateResourceException;
import com.example.customermanagement.model.*;
import com.example.customermanagement.repository.*;
import com.example.customermanagement.util.ExcelHelper;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;
    private final ExcelHelper excelHelper;

    public CustomerServiceImpl(CustomerRepository customerRepository, CityRepository cityRepository, CountryRepository countryRepository, ExcelHelper excelHelper) {
        this.customerRepository = customerRepository;
        this.cityRepository = cityRepository;
        this.countryRepository = countryRepository;
        this.excelHelper = excelHelper;
    }

    @Override
    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        if (customerRepository.existsByNic(customerDTO.getNic())) {
            throw new DuplicateResourceException("Customer with NIC " + customerDTO.getNic() + " already exists");
        }

        Customer customer = new Customer();
        mapDtoToEntity(customerDTO, customer);
        Customer savedCustomer = customerRepository.save(customer);
        return mapEntityToDto(savedCustomer);
    }

    @Override
    @Transactional
    public CustomerDTO updateCustomer(Long id, CustomerDTO customerDTO) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));

        // Check if NIC is being changed and if the new NIC already exists
        if (!customer.getNic().equals(customerDTO.getNic()) {
            if (customerRepository.existsByNic(customerDTO.getNic())) {
                throw new DuplicateResourceException("Customer with NIC " + customerDTO.getNic() + " already exists");
            }
        }

        // Clear existing collections
        customer.getMobileNumbers().clear();
        customer.getAddresses().clear();

        mapDtoToEntity(customerDTO, customer);
        Customer updatedCustomer = customerRepository.save(customer);
        return mapEntityToDto(updatedCustomer);
    }

    @Override
    public CustomerDTO getCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        return mapEntityToDto(customer);
    }

    @Override
    public List<CustomerDTO> getAllCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with id: " + id));
        customerRepository.delete(customer);
    }

    @Override
    @Transactional
    public BulkUploadResponse bulkUploadCustomers(MultipartFile file) {
        try {
            Workbook workbook = WorkbookFactory.create(file.getInputStream());
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            AtomicInteger successCount = new AtomicInteger();
            AtomicInteger failureCount = new AtomicInteger();
            List<String> errorMessages = new ArrayList<>();

            // Skip header row
            if (rows.hasNext()) {
                rows.next();
            }

            while (rows.hasNext()) {
                Row currentRow = rows.next();
                try {
                    CustomerDTO customerDTO = excelHelper.excelRowToCustomerDTO(currentRow);
                    if (!customerRepository.existsByNic(customerDTO.getNic())) {
                        createCustomer(customerDTO);
                        successCount.incrementAndGet();
                    } else {
                        failureCount.incrementAndGet();
                        errorMessages.add("Duplicate NIC: " + customerDTO.getNic());
                    }
                } catch (Exception e) {
                    failureCount.incrementAndGet();
                    errorMessages.add("Row " + currentRow.getRowNum() + ": " + e.getMessage());
                }
            }

            workbook.close();

            return BulkUploadResponse.builder()
                    .totalRecords(successCount.get() + failureCount.get())
                    .successCount(successCount.get())
                    .failureCount(failureCount.get())
                    .message(failureCount.get() > 0 ?
                            "Some records failed to process. Errors: " + String.join(", ", errorMessages) :
                            "All records processed successfully")
                    .build();

        } catch (IOException e) {
            throw new RuntimeException("Failed to parse Excel file: " + e.getMessage());
        }
    }

    private void mapDtoToEntity(CustomerDTO dto, Customer entity) {
        entity.setName(dto.getName());
        entity.setDateOfBirth(dto.getDateOfBirth());
        entity.setNic(dto.getNic());

        // Map mobile numbers
        if (dto.getMobileNumbers() != null) {
            dto.getMobileNumbers().forEach(number -> {
                MobileNumber mobileNumber = new MobileNumber();
                mobileNumber.setNumber(number);
                entity.addMobileNumber(mobileNumber);
            });
        }

        // Map addresses
        if (dto.getAddresses() != null) {
            dto.getAddresses().forEach(addressDTO -> {
                Address address = new Address();
                address.setAddressLine1(addressDTO.getAddressLine1());
                address.setAddressLine2(addressDTO.getAddressLine2());

                if (addressDTO.getCityId() != null) {
                    City city = cityRepository.findById(addressDTO.getCityId())
                            .orElseThrow(() -> new ResourceNotFoundException("City not found with id: " + addressDTO.getCityId()));
                    address.setCity(city);
                }

                if (addressDTO.getCountryId() != null) {
                    Country country = countryRepository.findById(addressDTO.getCountryId())
                            .orElseThrow(() -> new ResourceNotFoundException("Country not found with id: " + addressDTO.getCountryId()));
                    address.setCountry(country);
                }

                entity.addAddress(address);
            });
        }

        // Map family members
        if (dto.getFamilyMemberIds() != null) {
            dto.getFamilyMemberIds().forEach(familyMemberId -> {
                Customer familyMember = customerRepository.findById(familyMemberId)
                        .orElseThrow(() -> new ResourceNotFoundException("Family member not found with id: " + familyMemberId));
                entity.addFamilyMember(familyMember);
            });
        }
    }

    private CustomerDTO mapEntityToDto(Customer entity) {
        CustomerDTO dto = new CustomerDTO();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setDateOfBirth(entity.getDateOfBirth());
        dto.setNic(entity.getNic());

        // Map mobile numbers
        if (entity.getMobileNumbers() != null) {
            dto.setMobileNumbers(entity.getMobileNumbers().stream()
                    .map(MobileNumber::getNumber)
                    .collect(Collectors.toList()));
        }

        // Map addresses
        if (entity.getAddresses() != null) {
            dto.setAddresses(entity.getAddresses().stream()
                    .map(address -> {
                        AddressDTO addressDTO = new AddressDTO();
                        addressDTO.setAddressLine1(address.getAddressLine1());
                        addressDTO.setAddressLine2(address.getAddressLine2());
                        if (address.getCity() != null) {
                            addressDTO.setCityId(address.getCity().getId());
                        }
                        if (address.getCountry() != null) {
                            addressDTO.setCountryId(address.getCountry().getId());
                        }
                        return addressDTO;
                    })
                    .collect(Collectors.toList()));
        }

        // Map family members
        if (entity.getFamilyMembers() != null) {
            dto.setFamilyMemberIds(entity.getFamilyMembers().stream()
                    .map(Customer::getId)
                    .collect(Collectors.toList()));
        }

        return dto;
    }
}