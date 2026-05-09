package com.workout.workout.dto;

import lombok.Data;

@Data
public class WorkoutSetRequest {
    private Long exerciseId;
    private Double weight;
    private Integer reps;
}
