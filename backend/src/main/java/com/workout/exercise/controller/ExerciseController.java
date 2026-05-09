package com.workout.exercise.controller;

import com.workout.exercise.entity.BodyPart;
import com.workout.exercise.entity.Exercise;
import com.workout.exercise.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public List<Exercise> getExercises(@RequestParam(required = false) BodyPart bodyPart) {
        return exerciseService.getAllExercises(bodyPart);
    }

    @GetMapping("/{id}")
    public Exercise getExercise(@PathVariable Long id) {
        return exerciseService.getExerciseById(id);
    }

    @GetMapping("/search")
    public List<Exercise> searchExercises(@RequestParam String q) {
        return exerciseService.searchExercises(q);
    }
}
