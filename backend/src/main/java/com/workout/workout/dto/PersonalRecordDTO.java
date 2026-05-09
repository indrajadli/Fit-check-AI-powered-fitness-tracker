package com.workout.workout.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PersonalRecordDTO {
    private Long exerciseId;
    private String exerciseName;
    private String bodyPart;
    private Double weight;
    private Integer reps;
    private LocalDateTime date;
}
