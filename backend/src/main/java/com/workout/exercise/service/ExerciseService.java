package com.workout.exercise.service;

import com.workout.exercise.entity.BodyPart;
import com.workout.exercise.entity.Exercise;
import com.workout.exercise.repository.ExerciseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExerciseService {

    private final ExerciseRepository exerciseRepository;

    public List<Exercise> getAllExercises(BodyPart bodyPart) {
        if (bodyPart != null) {
            return exerciseRepository.findByBodyPart(bodyPart);
        }
        return exerciseRepository.findAll();
    }

    public Exercise getExerciseById(Long id) {
        return exerciseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Exercise not found with id: " + id));
    }

    public List<Exercise> searchExercises(String query) {
        return exerciseRepository.findByNameContainingIgnoreCase(query);
    }
}
