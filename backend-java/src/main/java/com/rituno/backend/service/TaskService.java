package com.rituno.backend.service;

import com.rituno.backend.dto.TaskRequest;
import com.rituno.backend.dto.TaskResponse;
import com.rituno.backend.model.Task;
import com.rituno.backend.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskResponse> getAllTasks(String userIdStr, String dayOfWeek) {
        UUID userId = UUID.fromString(userIdStr);
        List<Task> tasks;
        
        if (dayOfWeek != null && !dayOfWeek.isEmpty()) {
            tasks = taskRepository.findAllByUserIdAndDayOfWeek(userId, dayOfWeek);
        } else {
            tasks = taskRepository.findAllByUserId(userId);
        }
        
        return tasks.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional
    public TaskResponse createTask(String userIdStr, TaskRequest request) {
        UUID userId = UUID.fromString(userIdStr);
        
        Task task = Task.builder()
                .userId(userId)
                .title(request.title())
                .time(request.time())
                .category(request.category())
                .dayOfWeek(request.dayOfWeek())
                .completed(request.completed() != null ? request.completed() : false)
                .completedAt(request.completedAt())
                .currentStreak(0)
                .maxStreak(0)
                .totalCompletions(0)
                .build();
                
        Task savedTask = taskRepository.save(task);
        return mapToResponse(savedTask);
    }

    @Transactional
    public TaskResponse updateTask(UUID taskId, String userIdStr, TaskRequest request) {
        Task task = getTaskByIdAndUserId(taskId, userIdStr);

        if (request.title() != null) task.setTitle(request.title());
        if (request.time() != null) task.setTime(request.time());
        if (request.category() != null) task.setCategory(request.category());
        if (request.dayOfWeek() != null) task.setDayOfWeek(request.dayOfWeek());
        if (request.completed() != null) {
            task.setCompleted(request.completed());
            if (request.completed() && task.getCompletedAt() == null) {
                task.setCompletedAt(LocalDate.now());
            } else if (!request.completed()) {
                task.setCompletedAt(null);
            }
        }

        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    @Transactional
    public void deleteTask(UUID taskId, String userIdStr) {
        Task task = getTaskByIdAndUserId(taskId, userIdStr);
        taskRepository.delete(task);
    }

    @Transactional
    public TaskResponse toggleTaskCompletion(UUID taskId, String userIdStr) {
        Task task = getTaskByIdAndUserId(taskId, userIdStr);
        
        boolean isCompleted = task.getCompleted() != null && task.getCompleted();
        task.setCompleted(!isCompleted);
        
        if (!isCompleted) {
            task.setCompletedAt(LocalDate.now());
            // Streak logic would go here in a more complex scenario
            // For now we keep it simple as requested
            task.setTotalCompletions((task.getTotalCompletions() != null ? task.getTotalCompletions() : 0) + 1);
        } else {
            task.setCompletedAt(null);
        }
        
        Task updatedTask = taskRepository.save(task);
        return mapToResponse(updatedTask);
    }

    private Task getTaskByIdAndUserId(UUID taskId, String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        return taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Task not found"));
    }

    private TaskResponse mapToResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getTime(),
                task.getCategory(),
                task.getDayOfWeek(),
                task.getCompleted(),
                task.getCompletedAt(),
                task.getCurrentStreak(),
                task.getMaxStreak(),
                task.getTotalCompletions(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}
