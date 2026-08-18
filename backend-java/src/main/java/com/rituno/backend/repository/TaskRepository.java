package com.rituno.backend.repository;

import com.rituno.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TaskRepository extends JpaRepository<Task, UUID> {
    
    List<Task> findAllByUserId(UUID userId);
    
    List<Task> findAllByUserIdAndDayOfWeek(UUID userId, String dayOfWeek);
    
    Optional<Task> findByIdAndUserId(UUID id, UUID userId);
}
