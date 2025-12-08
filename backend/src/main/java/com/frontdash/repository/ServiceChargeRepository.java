package com.frontdash.repository;

import com.frontdash.entity.ServiceCharge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceChargeRepository extends JpaRepository<ServiceCharge, Integer> {
}
