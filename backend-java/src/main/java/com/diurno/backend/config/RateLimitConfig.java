package com.diurno.backend.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Configuração e gerenciador do Rate Limiting em memória usando Bucket4j.
 * Limita 20 requisições por minuto por userId autenticado e remove buckets ociosos.
 */
@Component
public class RateLimitConfig {

    private static final Logger log = LoggerFactory.getLogger(RateLimitConfig.class);
    private static final long BUCKET_TTL_MS = 3600_000L; // 1 hora sem acesso
    private final Map<String, BucketEntry> cache = new ConcurrentHashMap<>();

    private record BucketEntry(Bucket bucket, long lastAccessedMs) {}

    /**
     * Resolve ou cria um Bucket de limite de taxa para o userId especificado.
     *
     * @param userId ID do usuário autenticado no Firebase Auth
     * @return Bucket associado àquele usuário
     */
    public Bucket resolveBucket(String userId) {
        long now = System.currentTimeMillis();
        BucketEntry entry = cache.compute(userId, (key, existing) -> {
            if (existing == null) {
                return new BucketEntry(newBucket(userId), now);
            }
            return new BucketEntry(existing.bucket(), now);
        });
        return entry.bucket();
    }

    private Bucket newBucket(String userId) {
        // Limite de 20 requisições por minuto (refill de 20 tokens a cada 60 segundos)
        Bandwidth limit = Bandwidth.builder()
                .capacity(20)
                .refillGreedy(20, Duration.ofMinutes(1))
                .build();
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    /**
     * Tenta consumir 1 token do bucket associado ao usuário.
     *
     * @param userId ID do usuário
     * @return true se a requisição é permitida, false se o limite de 20/min foi excedido
     */
    public boolean tryConsume(String userId) {
        Bucket bucket = resolveBucket(userId);
        return bucket.tryConsume(1);
    }

    /**
     * Limpeza automática programada para evitar vazamento de memória com usuários inativos.
     * Roda a cada 1 hora (3600000 ms).
     */
    @Scheduled(fixedRate = 3600000)
    public void purgeInactiveBuckets() {
        long cutoff = System.currentTimeMillis() - BUCKET_TTL_MS;
        int removed = 0;
        for (Map.Entry<String, BucketEntry> entry : cache.entrySet()) {
            if (entry.getValue().lastAccessedMs() < cutoff) {
                cache.remove(entry.getKey());
                removed++;
            }
        }
        if (removed > 0) {
            log.info("RateLimitConfig: {} buckets inativos foram removidos do cache de rate limit.", removed);
        }
    }
}

