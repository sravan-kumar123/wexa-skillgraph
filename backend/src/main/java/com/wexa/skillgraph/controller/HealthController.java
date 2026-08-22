package com.wexa.skillgraph.controller;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Session;
import org.neo4j.driver.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final Driver driver;

    @Autowired
    public HealthController(Driver driver) {
        this.driver = driver;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "SkillGraph API");
    }

    @GetMapping("/health/db")
    public ResponseEntity<Map<String, Object>> healthDb() {
        try (Session session = driver.session()) {
            Result result = session.run("RETURN 1 AS ok");
            int ok = result.single().get("ok").asInt();
            if (ok == 1) {
                return ResponseEntity.ok(Map.of("status", "UP", "database", "CognoDB"));
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("status", "DOWN", "message", "Unexpected response from CognoDB"));
            }
        } catch (Exception e) {
            // Do not expose stack traces or credentials in response
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("status", "DOWN", "message", "Failed to connect to CognoDB"));
        }
    }
}
