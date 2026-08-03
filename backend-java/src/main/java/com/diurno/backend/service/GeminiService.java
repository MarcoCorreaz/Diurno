package com.diurno.backend.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

/**
 * Serviço de integração com a API REST do Google Gemini.
 * Utiliza Spring Boot 3 RestClient (mais leve, simples e fácil de manter com GEMINI_API_KEY).
 */
@Service
public class GeminiService {

    private static final Logger log = LoggerFactory.getLogger(GeminiService.class);
    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    private final RestClient restClient;
    private final String apiKey;

    public GeminiService(@Value("${gemini.api-key:}") String apiKey) {
        this.apiKey = apiKey;
        this.restClient = RestClient.builder()
                .defaultHeader("Content-Type", MediaType.APPLICATION_JSON_VALUE)
                .build();
    }

    /**
     * Envia o prompt/mensagem para a API do Gemini 2.5 Flash e retorna o texto gerado.
     *
     * @param message texto enviado pelo usuário no chat
     * @return resposta de texto gerada pelo Gemini
     * @throws RuntimeException em caso de erro na chamada externa ou ausência de chave de API
     */
    public String generateContent(String message) {
        if (apiKey == null || apiKey.isBlank()) {
            log.error("GEMINI_API_KEY não está configurada nas variáveis de ambiente.");
            throw new IllegalStateException("GEMINI_API_KEY is not configured");
        }
        if (message == null || message.trim().isEmpty()) {
            throw new IllegalArgumentException("A mensagem enviada não pode estar vazia.");
        }

        try {
            GeminiRequest payload = new GeminiRequest(
                    List.of(new Content(List.of(new Part(message))))
            );

            GeminiResponse response = restClient.post()
                    .uri(GEMINI_API_URL + "?key={key}", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(payload)
                    .retrieve()
                    .body(GeminiResponse.class);

            if (response != null && response.candidates() != null && !response.candidates().isEmpty()) {
                Candidate candidate = response.candidates().get(0);
                if (candidate.content() != null && candidate.content().parts() != null && !candidate.content().parts().isEmpty()) {
                    return candidate.content().parts().get(0).text();
                }
            }

            throw new RuntimeException("Resposta vazia ou em formato inesperado retornada pela API do Gemini.");
        } catch (Exception e) {
            log.error("Erro ao comunicar com a API do Gemini: {}", e.getMessage(), e);
            throw new RuntimeException("Erro ao se comunicar com a IA. Tente novamente.", e);
        }
    }

    // --- DTOs Internos para o payload REST da API do Gemini ---

    public record GeminiRequest(List<Content> contents) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record GeminiResponse(List<Candidate> candidates) {}

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Candidate(Content content) {}
}
