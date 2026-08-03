package com.diurno.backend.config;

import com.diurno.backend.dto.ErrorResponse;
import com.diurno.backend.service.FirebaseAuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseToken;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * Filtro que intercepta requisições, verifica o token de ID do Firebase Auth
 * no cabeçalho Authorization e aplica o rate limit por usuário.
 */
@Component
public class FirebaseAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthFilter.class);
    private static final String AUTHORIZATION_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    private final FirebaseAuthService firebaseAuthService;
    private final RateLimitConfig rateLimitConfig;
    private final ObjectMapper objectMapper;

    public FirebaseAuthFilter(FirebaseAuthService firebaseAuthService,
                              RateLimitConfig rateLimitConfig,
                              ObjectMapper objectMapper) {
        this.firebaseAuthService = firebaseAuthService;
        this.rateLimitConfig = rateLimitConfig;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Permite acesso público aos endpoints do Actuator (ex: /actuator/health) e OPTIONS para CORS pre-flight
        if (path.startsWith("/actuator") || "OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String header = request.getHeader(AUTHORIZATION_HEADER);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Token de autenticação ausente ou inválido.");
            return;
        }

        String token = header.substring(BEARER_PREFIX.length()).trim();
        FirebaseToken decodedToken = firebaseAuthService.verifyIdToken(token);

        if (decodedToken == null) {
            sendErrorResponse(response, HttpStatus.UNAUTHORIZED, "Token de autenticação ausente ou inválido.");
            return;
        }

        String userId = decodedToken.getUid();

        // Verificação do rate limiting (20 requisições por minuto por userId)
        if (!rateLimitConfig.tryConsume(userId)) {
            log.warn("Rate limit excedido para o usuário: {}", userId);
            sendErrorResponse(response, HttpStatus.TOO_MANY_REQUESTS, "Muitas requisições. Tente novamente mais tarde.");
            return;
        }

        // Configura o usuário autenticado no contexto do Spring Security
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                userId, decodedToken, Collections.emptyList()
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        request.setAttribute("userId", userId);

        filterChain.doFilter(request, response);
    }

    private void sendErrorResponse(HttpServletResponse response, HttpStatus status, String message) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        objectMapper.writeValue(response.getWriter(), new ErrorResponse(message));
    }
}
