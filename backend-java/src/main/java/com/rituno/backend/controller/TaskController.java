package com.rituno.backend.controller;

import com.rituno.backend.dto.TaskRequest;
import com.rituno.backend.dto.TaskResponse;
import com.rituno.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks(
            Authentication authentication,
            @RequestParam(required = false) String dayOfWeek) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.getAllTasks(userId, dayOfWeek));
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(
            Authentication authentication,
            @Valid @RequestBody TaskRequest request) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(taskService.createTask(userId, request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> updateTask(
            @PathVariable UUID id,
            Authentication authentication,
            @RequestBody TaskRequest request) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.updateTask(id, userId, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(
            @PathVariable UUID id,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        taskService.deleteTask(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<TaskResponse> toggleCompletion(
            @PathVariable UUID id,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(taskService.toggleTaskCompletion(id, userId));
    }
}
