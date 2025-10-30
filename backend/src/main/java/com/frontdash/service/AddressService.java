package com.frontdash.service;

import com.frontdash.dao.request.AddressRequest;
import com.frontdash.dao.response.AddressResponse;
import com.frontdash.entity.Address;
import com.frontdash.repository.AddressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AddressService {

    @Autowired
    private AddressRepository addressRepository;

    public AddressResponse createAddress(AddressRequest request) {
        Address addr = Address.builder()
                .streetAddress(request.getStreetAddress())
                .city(request.getCity())
                .state(request.getState())
                .zipCode(request.getZipCode())
                .build();

        Address saved = addressRepository.save(addr);
        return AddressResponse.builder()
                .addressId(saved.getAddressId())
                .streetAddress(saved.getStreetAddress())
                .city(saved.getCity())
                .state(saved.getState())
                .zipCode(saved.getZipCode())
                .build();
    }

    public Address getAddressEntityById(Integer id) {
        return addressRepository.findById(id).orElse(null);
    }
}
