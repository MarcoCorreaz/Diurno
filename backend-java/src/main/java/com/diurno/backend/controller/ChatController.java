package com.diurno.backend.controller;

import com.diurno.backend.dto.ChatRequest;
import com.diurno.backend.dto.ChatResponse;
import com.diurno.backend.dto.ErrorResponse;
import com.diurno.backend.service.GeminiService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller do endpoint de chat com a inteligência artificial (Gemini 2.5 Flash).
 * Rota: POST /api/chat
 */
@RestController
@RequestMapping("/api")
public class ChatController {

    private static final Logger log = LoggerFactory.getLogger(ChatController.class);
    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody(required = false) ChatRequest request) {
        // Replica validação exata do contrato atual em server.ts (400 Bad Request)
        if (request == null || request.message() == null || request.message().isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse("Message is required"));
        }

        try {
            String text = geminiService.generateContent(request.message());
            return ResponseEntity.ok(new ChatResponse(text));
        } catch (Exception e) {
            log.error("Erro no processamento do chat: {}", e.getMessage(), e);
            // Replica mensagem e status exatos do contrato em server.ts (502 Bad Gateway)
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(new ErrorResponse("Erro ao se comunicar com a IA. Tente novamente."));
        }
    }
}
