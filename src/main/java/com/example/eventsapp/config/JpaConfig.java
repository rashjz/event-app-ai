package com.example.eventsapp.config; 

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EntityScan("com.example.eventsapp.model")
@EnableJpaRepositories("com.example.eventsapp.repository")
public class JpaConfig {
} 