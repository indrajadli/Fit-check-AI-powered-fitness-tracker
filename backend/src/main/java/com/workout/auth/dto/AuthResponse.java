package com.workout.auth.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String accessToken;
    private String refreshToken;
    private String username;
    private String email;
    @Builder.Default
    private String tokenType = "Bearer";
}
