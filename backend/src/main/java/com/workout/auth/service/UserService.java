package com.workout.auth.service;

import com.workout.auth.dto.UserProfileRequest;
import com.workout.auth.entity.User;
import com.workout.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User getProfile(User user) {
        return userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Transactional
    public User updateProfile(User user, UserProfileRequest request) {
        User existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setFirstName(request.getFirstName());
        existingUser.setLastName(request.getLastName());
        existingUser.setHeightCm(request.getHeightCm());
        existingUser.setWeightKg(request.getWeightKg());
        existingUser.setGender(request.getGender());
        existingUser.setBio(request.getBio());

        return userRepository.save(existingUser);
    }
}
