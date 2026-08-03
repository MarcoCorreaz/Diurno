package com.diurno.backend.dto;

/**
 * DTO de resposta de sucesso para o endpoint /api/chat.
 * Mantém paridade exata com o contrato do frontend React ({ text: string }).
 */
public record ChatResponse(
    String text
) {}
