package com.diurno.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * DTO para requisição de chat na rota POST /api/chat.
 * Mantém paridade exata com o payload do frontend React ({ message: string }).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public record ChatRequest(
    String message
) {}
