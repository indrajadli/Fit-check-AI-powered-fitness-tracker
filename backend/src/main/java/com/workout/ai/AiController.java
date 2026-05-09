package com.workout.ai;

import com.workout.exercise.entity.Exercise;
import com.workout.exercise.service.ExerciseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;
    private final ExerciseService exerciseService;

    @GetMapping("/coach/exercise/{exerciseId}")
    public ResponseEntity<Map<String, String>> getCoachAdvice(@PathVariable Long exerciseId) {
        Exercise exercise = exerciseService.getExerciseById(exerciseId);
        String advice = aiService.getExerciseAdvice(exercise.getName(), exercise.getBodyPart().name());
        return ResponseEntity.ok(java.util.Map.of("advice", advice));
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chatWithCoach(@RequestBody Map<String, String> request) {
        Long exerciseId = Long.parseLong(request.get("exerciseId"));
        String question = request.get("question");
        Exercise exercise = exerciseService.getExerciseById(exerciseId);
        
        String response = aiService.chatWithCoach(exercise.getName(), exercise.getBodyPart().name(), question);
        return ResponseEntity.ok(java.util.Map.of("response", response));
    }
}
