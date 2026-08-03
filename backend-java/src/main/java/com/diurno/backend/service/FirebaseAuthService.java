package com.diurno.backend.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Serviço responsável pela verificação de tokens de autenticação do Firebase Admin SDK.
 */
@Service
public class FirebaseAuthService {

    private static final Logger log = LoggerFactory.getLogger(FirebaseAuthService.class);

    @Value("${firebase.project-id:}")
    private String projectId;

    @Value("${firebase.credentials-file:}")
    private String credentialsFile;

    @PostConstruct
    public void initializeFirebase() {
        try {
            if (!FirebaseApp.getApps().isEmpty()) {
                log.info("FirebaseApp já inicializado.");
                return;
            }

            FirebaseOptions.Builder optionsBuilder = FirebaseOptions.builder();

            if (credentialsFile != null && !credentialsFile.isBlank()) {
                try (InputStream serviceAccount = new FileInputStream(credentialsFile)) {
                    optionsBuilder.setCredentials(GoogleCredentials.fromStream(serviceAccount));
                    log.info("FirebaseApp inicializado com arquivo de credenciais: {}", credentialsFile);
                }
            } else {
                // Utiliza Application Default Credentials (ideal para Cloud Run/GCP ou quando GOOGLE_APPLICATION_CREDENTIALS está definido)
                try {
                    optionsBuilder.setCredentials(GoogleCredentials.getApplicationDefault());
                    log.info("FirebaseApp inicializado usando Google Application Default Credentials.");
                } catch (IOException e) {
                    log.warn("Application Default Credentials não disponíveis. Inicializando em modo não credenciado (apenas para testes locais sem credenciais).", e);
                }
            }

            if (projectId != null && !projectId.isBlank()) {
                optionsBuilder.setProjectId(projectId);
            }

            FirebaseApp.initializeApp(optionsBuilder.build());
            log.info("FirebaseApp inicializado com sucesso para o projeto: {}", projectId);
        } catch (Exception e) {
            log.error("Erro ao inicializar o Firebase Admin SDK: {}", e.getMessage(), e);
        }
    }

    /**
     * Valida um token de ID do Firebase Auth (JWT Bearer Token).
     *
     * @param idToken string do token obtido no header Authorization
     * @return FirebaseToken contendo UID e claims do usuário, ou null se inválido
     */
    public FirebaseToken verifyIdToken(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            return null;
        }
        try {
            return FirebaseAuth.getInstance().verifyIdToken(idToken, true);
        } catch (FirebaseAuthException e) {
            log.warn("Token Firebase ID inválido ou expirado: {}", e.getMessage());
            return null;
        } catch (Exception e) {
            log.error("Erro inesperado na validação do token Firebase: {}", e.getMessage());
            return null;
        }
    }
}
