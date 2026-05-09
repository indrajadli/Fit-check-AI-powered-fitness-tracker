package com.workout.workout.controller;

import com.workout.auth.entity.User;
import com.workout.workout.dto.WorkoutSetRequest;
import com.workout.workout.entity.WorkoutSession;
import com.workout.workout.entity.WorkoutSet;
import com.workout.workout.service.WorkoutService;
import com.workout.workout.dto.PersonalRecordDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutService workoutService;

    @PostMapping("/start")
    public ResponseEntity<WorkoutSession> startSession(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workoutService.startSession(user));
    }

    @GetMapping("/active")
    public ResponseEntity<WorkoutSession> getActiveSession(@AuthenticationPrincipal User user) {
        try {
            return ResponseEntity.ok(workoutService.getActiveSession(user));
        } catch (IllegalStateException e) {
            return ResponseEntity.noContent().build();
        }
    }

    @PostMapping("/sets")
    public ResponseEntity<WorkoutSet> addSet(@AuthenticationPrincipal User user, @RequestBody WorkoutSetRequest request) {
        return ResponseEntity.ok(workoutService.addSet(user, request));
    }

    @PutMapping("/sets/{setId}")
    public ResponseEntity<WorkoutSet> updateSet(
            @AuthenticationPrincipal User user, 
            @PathVariable Long setId,
            @RequestParam Double weight,
            @RequestParam Integer reps) {
        return ResponseEntity.ok(workoutService.updateSet(user, setId, weight, reps));
    }

    @PatchMapping("/sets/{setId}/toggle")
    public ResponseEntity<WorkoutSet> toggleSetCompletion(@AuthenticationPrincipal User user, @PathVariable Long setId) {
        return ResponseEntity.ok(workoutService.toggleSetCompletion(user, setId));
    }

    @DeleteMapping("/sets/{setId}")
    public ResponseEntity<Void> deleteSet(@AuthenticationPrincipal User user, @PathVariable Long setId) {
        workoutService.deleteSet(user, setId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/finish")
    public ResponseEntity<WorkoutSession> finishSession(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workoutService.finishSession(user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutSession>> getHistory(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workoutService.getHistory(user));
    }

    @GetMapping("/records")
    public ResponseEntity<List<PersonalRecordDTO>> getRecords(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(workoutService.getPersonalRecords(user));
    }
}
