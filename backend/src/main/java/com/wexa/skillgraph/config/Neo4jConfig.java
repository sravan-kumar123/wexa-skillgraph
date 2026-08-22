package com.wexa.skillgraph.config;

import org.neo4j.driver.AuthTokens;
import org.neo4j.driver.Driver;
import org.neo4j.driver.GraphDatabase;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import jakarta.annotation.PreDestroy;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Configuration
public class Neo4jConfig {
    
    private static final Logger log = LoggerFactory.getLogger(Neo4jConfig.class);

    @Value("${cogno.db.uri}")
    private String uri;

    @Value("${cogno.db.user}")
    private String user;

    @Value("${cogno.db.password}")
    private String password;
    
    private Driver driver;

    @Bean
    public Driver neo4jDriver() {
        log.info("Initializing Neo4j Java Driver for CognoDB...");
        this.driver = GraphDatabase.driver(uri, AuthTokens.basic(user, password));
        return this.driver;
    }
    
    @PreDestroy
    public void closeDriver() {
        if (this.driver != null) {
            log.info("Closing Neo4j Java Driver...");
            this.driver.close();
        }
    }
}
