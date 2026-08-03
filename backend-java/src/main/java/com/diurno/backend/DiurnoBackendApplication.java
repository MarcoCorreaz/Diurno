package com.diurno.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Ponto de entrada do serviço Java 21 / Spring Boot 3 para o Diurno.
 */
@SpringBootApplication
@EnableScheduling
public class DiurnoBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(DiurnoBackendApplication.class, args);
    }
}
