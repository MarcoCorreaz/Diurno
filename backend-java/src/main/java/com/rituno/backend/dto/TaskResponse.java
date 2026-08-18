package com.rituno.backend.dto;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.UUID;

public record TaskResponse(
    UUID id,
    String title,
    String time,
    String category,
    String dayOfWeek,
    Boolean completed,
    LocalDate completedAt,
    Integer currentStreak,
    Integer maxStreak,
    Integer totalCompletions,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
