package com.workout.auth.dto;

import lombok.Data;

@Data
public class UserProfileRequest {
    private String firstName;
    private String lastName;
    private Double heightCm;
    private Double weightKg;
    private String gender;
    private String bio;
}
