package com.frontdash.controller;

import com.frontdash.dao.request.AddressRequest;
import com.frontdash.dao.response.AddressResponse;
import com.frontdash.service.AddressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping
    public ResponseEntity<AddressResponse> createAddress(@RequestBody AddressRequest request) {
        AddressResponse resp = addressService.createAddress(request);
        return ResponseEntity.ok(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AddressResponse> getAddress(@PathVariable Integer id) {
        var addr = addressService.getAddressEntityById(id);
        if (addr == null) return ResponseEntity.notFound().build();
        AddressResponse resp = AddressResponse.builder()
                .addressId(addr.getAddressId())
                .streetAddress(addr.getStreetAddress())
                .city(addr.getCity())
                .state(addr.getState())
                .zipCode(addr.getZipCode())
                .build();
        return ResponseEntity.ok(resp);
    }
}
