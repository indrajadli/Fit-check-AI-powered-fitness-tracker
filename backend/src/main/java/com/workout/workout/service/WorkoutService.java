package com.workout.workout.service;

import com.workout.auth.entity.User;
import com.workout.exercise.entity.Exercise;
import com.workout.exercise.repository.ExerciseRepository;
import com.workout.workout.dto.WorkoutSetRequest;
import com.workout.workout.dto.PersonalRecordDTO;
import com.workout.workout.entity.WorkoutSession;
import com.workout.workout.entity.WorkoutSet;
import com.workout.workout.entity.WorkoutStatus;
import com.workout.workout.repository.WorkoutSessionRepository;
import com.workout.workout.repository.WorkoutSetRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkoutService {

    private final WorkoutSessionRepository sessionRepository;
    private final WorkoutSetRepository setRepository;
    private final ExerciseRepository exerciseRepository;

    public WorkoutSession startSession(User user) {
        sessionRepository.findByUserAndStatus(user, WorkoutStatus.ACTIVE)
                .ifPresent(session -> {
                    throw new IllegalStateException("You already have an active workout session");
                });

        WorkoutSession session = WorkoutSession.builder()
                .user(user)
                .startTime(LocalDateTime.now())
                .status(WorkoutStatus.ACTIVE)
                .totalVolume(0.0)
                .build();

        return sessionRepository.save(session);
    }

    public WorkoutSession getActiveSession(User user) {
        return sessionRepository.findByUserAndStatus(user, WorkoutStatus.ACTIVE)
                .orElseThrow(() -> new IllegalStateException("No active session found"));
    }

    @Transactional
    public WorkoutSet addSet(User user, WorkoutSetRequest request) {
        WorkoutSession session = getActiveSession(user);
        Exercise exercise = exerciseRepository.findById(request.getExerciseId())
                .orElseThrow(() -> new IllegalArgumentException("Exercise not found"));

        WorkoutSet set = WorkoutSet.builder()
                .session(session)
                .exercise(exercise)
                .weight(request.getWeight())
                .reps(request.getReps())
                .order(session.getSets().size() + 1)
                .build();

        WorkoutSet savedSet = setRepository.save(set);
        session.setTotalVolume(session.getTotalVolume() + (request.getWeight() * request.getReps()));
        sessionRepository.save(session);
        
        return savedSet;
    }

    @Transactional
    public WorkoutSet updateSet(User user, Long setId, Double weight, Integer reps) {
        WorkoutSession session = getActiveSession(user);
        WorkoutSet set = setRepository.findById(setId)
                .orElseThrow(() -> new IllegalArgumentException("Set not found"));

        if (!set.getSession().getId().equals(session.getId())) {
            throw new IllegalArgumentException("Set does not belong to your active session");
        }

        double oldVolume = (set.getWeight() != null ? set.getWeight() : 0.0) * (set.getReps() != null ? set.getReps() : 0);
        double newVolume = weight * reps;
        session.setTotalVolume(session.getTotalVolume() - oldVolume + newVolume);

        set.setWeight(weight);
        set.setReps(reps);
        
        sessionRepository.save(session);
        return setRepository.save(set);
    }

    @Transactional
    public void deleteSet(User user, Long setId) {
        WorkoutSession session = getActiveSession(user);
        WorkoutSet set = setRepository.findById(setId)
                .orElseThrow(() -> new IllegalArgumentException("Set not found"));

        if (!set.getSession().getId().equals(session.getId())) {
            throw new IllegalArgumentException("Set does not belong to your active session");
        }

        session.setTotalVolume(session.getTotalVolume() - (set.getWeight() * set.getReps()));
        setRepository.delete(set);
        sessionRepository.save(session);
    }

    @Transactional
    public WorkoutSet toggleSetCompletion(User user, Long setId) {
        WorkoutSession session = getActiveSession(user);
        WorkoutSet set = setRepository.findById(setId)
                .orElseThrow(() -> new IllegalArgumentException("Set not found"));

        if (!set.getSession().getId().equals(session.getId())) {
            throw new IllegalArgumentException("Set does not belong to your active session");
        }

        set.setCompleted(!set.getCompleted());
        return setRepository.save(set);
    }

    @Transactional
    public WorkoutSession finishSession(User user) {
        WorkoutSession session = getActiveSession(user);
        session.setEndTime(LocalDateTime.now());
        session.setStatus(WorkoutStatus.FINISHED);
        
        double totalVolume = session.getSets().stream()
                .filter(set -> set.getWeight() != null && set.getReps() != null)
                .mapToDouble(set -> set.getWeight() * set.getReps())
                .sum();
        session.setTotalVolume(totalVolume);

        return sessionRepository.save(session);
    }

    public List<WorkoutSession> getHistory(User user) {
        return sessionRepository.findByUserOrderByStartTimeDesc(user);
    }

    @Transactional(readOnly = true)
    public List<PersonalRecordDTO> getPersonalRecords(User user) {
        log.info("Calculating PRs for user: {} (ID: {})", user.getUsername(), user.getId());
        
        // Use robust JOIN FETCH query to prevent LazyInitializationException
        List<WorkoutSession> finishedSessions = sessionRepository.findAllByUserIdAndStatusWithSets(user.getId(), WorkoutStatus.FINISHED);
        
        Map<Long, PersonalRecordDTO> prMap = new HashMap<>();
        
        for (WorkoutSession session : finishedSessions) {
            for (WorkoutSet set : session.getSets()) {
                Exercise ex = set.getExercise();
                if (ex == null) continue;
                
                Double weight = set.getWeight() != null ? set.getWeight() : 0.0;
                
                if (!prMap.containsKey(ex.getId()) || weight > prMap.get(ex.getId()).getWeight()) {
                    prMap.put(ex.getId(), PersonalRecordDTO.builder()
                            .exerciseId(ex.getId())
                            .exerciseName(ex.getName())
                            .bodyPart(ex.getBodyPart())
                            .weight(weight)
                            .reps(set.getReps() != null ? set.getReps() : 0)
                            .date(session.getStartTime())
                            .build());
                }
            }
        }
        
        log.info("Found {} personal records", prMap.size());
        return prMap.values().stream()
                .sorted((a, b) -> b.getWeight().compareTo(a.getWeight()))
                .collect(Collectors.toList());
    }
}
