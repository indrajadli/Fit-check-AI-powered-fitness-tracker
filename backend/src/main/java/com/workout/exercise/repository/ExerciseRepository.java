package com.workout.exercise.repository;

import com.workout.exercise.entity.BodyPart;
import com.workout.exercise.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByBodyPart(BodyPart bodyPart);
    List<Exercise> findByNameContainingIgnoreCase(String name);
}
