package com.diurno.backend.dto;

/**
 * DTO de resposta de erro para toda a API.
 * Mantém paridade com o contrato { error: string } esperado pelo frontend.
 */
public record ErrorResponse(
    String error
) {}
