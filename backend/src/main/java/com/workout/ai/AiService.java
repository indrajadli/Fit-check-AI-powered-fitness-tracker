package com.workout.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${app.gemini.api-key}")
    private String apiKey;

    @Value("${app.gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getExerciseAdvice(String exerciseName, String bodyPart) {
        if ("your_gemini_key_here".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return getFallbackAdvice(exerciseName, bodyPart);
        }

        String prompt = String.format(
            "You are the world's most detailed and encyclopedic AI Fitness Coach. Provide an absolute, exhaustive, master-level analysis of the exercise: %s (Targeting: %s). " +
            "Your response must be thorough and broken into these exact sections with these headers:\n" +
            "### OVERVIEW & ANATOMY\n" +
            "### MASTER-LEVEL SETUP & EXECUTION\n" +
            "### ADVANCED FORM & BIOMECHANICS\n" +
            "### ELITE CUES & PROGRAMMING\n" +
            "Be authoritative, scientific, and deeply motivating.", exerciseName, bodyPart);

        try {
            return callGemini(prompt);
        } catch (Exception e) {
            System.err.println("Gemini API error: " + e.getMessage());
            return getFallbackAdvice(exerciseName, bodyPart);
        }
    }

    public String chatWithCoach(String exerciseName, String bodyPart, String question) {
        if ("your_gemini_key_here".equals(apiKey) || apiKey == null || apiKey.isEmpty()) {
            return "I'm currently in offline mode. Please configure a Google Gemini API key to start a live chat!";
        }

        String prompt = String.format(
            "You are the world's most elite AI Fitness Coach. You are currently helping a user with the exercise: %s (Body Part: %s). " +
            "Answer the following user question with absolute precision, scientific accuracy, and a motivating tone: %s", 
            exerciseName, bodyPart, question);

        try {
            return callGemini(prompt);
        } catch (Exception e) {
            return "The AI Coach is currently busy analyzing some heavy sets. Please try again in a moment!";
        }
    }

    private String callGemini(String prompt) {
        String url = String.format("https://generativelanguage.googleapis.com/v1/models/%s:generateContent?key=%s", model, apiKey);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Construct Gemini request body
        Map<String, Object> requestBody = new HashMap<>();
        List<Map<String, Object>> contents = new ArrayList<>();
        Map<String, Object> content = new HashMap<>();
        List<Map<String, String>> parts = new ArrayList<>();
        parts.add(Map.of("text", prompt));
        content.put("parts", parts);
        contents.add(content);
        requestBody.put("contents", contents);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
        
        if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
            try {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.getBody().get("candidates");
                Map<String, Object> firstCandidate = candidates.get(0);
                Map<String, Object> contentObj = (Map<String, Object>) firstCandidate.get("content");
                List<Map<String, Object>> resParts = (List<Map<String, Object>>) contentObj.get("parts");
                return (String) resParts.get(0).get("text");
            } catch (Exception e) {
                throw new RuntimeException("Failed to parse Gemini response");
            }
        }
        
        throw new RuntimeException("Gemini API returned status: " + response.getStatusCode());
    }

    private String getFallbackAdvice(String exerciseName, String bodyPart) {
        String name = exerciseName.toLowerCase();
        
        if (name.contains("bench press")) {
            return "### OVERVIEW & ANATOMY\n" +
                   "The Bench Press is the definitive compound movement for building upper body pushing power and chest mass.\n\n" +
                   "### MASTER-LEVEL SETUP & EXECUTION\n" +
                   "1. Lie on a flat bench with your eyes under the bar.\n" +
                   "2. Grip the bar slightly wider than shoulder-width.\n" +
                   "3. Lower the bar to your mid-chest with controlled speed.\n" +
                   "4. Drive the weight back up to full lockout.\n\n" +
                   "### ADVANCED FORM & BIOMECHANICS\n" +
                   "- Keep your feet planted firmly for leg drive.\n" +
                   "- Retract your shoulder blades to protect your rotator cuffs.\n\n" +
                   "### ELITE CUES & PROGRAMMING\n" +
                   "Inhale on the way down, and exhale forcefully at the sticking point of the press.";
        }
        
        return String.format("### OVERVIEW\n" +
            "Focus on a strong mind-muscle connection in your %s.\n\n" +
            "### HOW TO PERFORM\n" +
            "1. Setup with stable positioning.\n" +
            "2. Perform a full range of motion.\n" +
            "3. Control the weight on the descent.", bodyPart);
    }
}
