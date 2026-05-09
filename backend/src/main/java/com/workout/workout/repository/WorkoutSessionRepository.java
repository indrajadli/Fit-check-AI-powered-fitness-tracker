package com.workout.workout.repository;

import com.workout.auth.entity.User;
import com.workout.workout.entity.WorkoutSession;
import com.workout.workout.entity.WorkoutStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    Optional<WorkoutSession> findByUserAndStatus(User user, WorkoutStatus status);
    List<WorkoutSession> findAllByUserAndStatus(User user, WorkoutStatus status);
    List<WorkoutSession> findByUserOrderByStartTimeDesc(User user);

    @org.springframework.data.jpa.repository.Query("SELECT DISTINCT s FROM WorkoutSession s LEFT JOIN FETCH s.sets WHERE s.user.id = :userId AND s.status = :status")
    List<WorkoutSession> findAllByUserIdAndStatusWithSets(@org.springframework.data.repository.query.Param("userId") Long userId, @org.springframework.data.repository.query.Param("status") WorkoutStatus status);
}
