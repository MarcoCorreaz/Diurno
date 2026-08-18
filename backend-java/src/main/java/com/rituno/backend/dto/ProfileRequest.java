package com.rituno.backend.dto;

public record ProfileRequest(
    String name,
    String goal,
    String energy,
    String routineDetails
) {}
