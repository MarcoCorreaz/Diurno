package com.rituno.backend.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public record ProfileResponse(
    UUID id,
    String name,
    String email,
    String goal,
    String energy,
    String routineDetails,
    String plan,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {}
