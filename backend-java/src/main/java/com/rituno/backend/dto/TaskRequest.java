package com.rituno.backend.dto;

import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;

public record TaskRequest(
    @NotBlank(message = "Title is required") String title,
    String time,
    String category,
    String dayOfWeek,
    Boolean completed,
    LocalDate completedAt
) {}
