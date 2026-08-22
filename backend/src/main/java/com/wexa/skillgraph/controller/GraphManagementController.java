package com.wexa.skillgraph.controller;

import org.neo4j.driver.Driver;
import org.neo4j.driver.Result;
import org.neo4j.driver.Session;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/graph")
public class GraphManagementController {

    private static final Logger log = LoggerFactory.getLogger(GraphManagementController.class);

    private final Driver driver;

    @Autowired
    public GraphManagementController(Driver driver) {
        this.driver = driver;
    }

    @PostMapping("/seed")
    public ResponseEntity<Map<String, Object>> seedDatabase() {
        Map<String, Object> response = new HashMap<>();
        try (Session session = driver.session()) {
            
            // Execute schema.cypher
            String schemaSql = loadCypher("graph/schema.cypher");
            executeCypherStatements(session, schemaSql);
            
            // Execute seed.cypher
            String seedSql = loadCypher("graph/seed.cypher");
            executeCypherStatements(session, seedSql);

            response.put("status", "SUCCESS");
            response.put("message", "Graph data model and seed data applied successfully.");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("Failed to execute seed.", e);
            response.put("status", "ERROR");
            response.put("message", "Failed to seed database. Check logs.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyDatabase() {
        Map<String, Object> response = new HashMap<>();
        try (Session session = driver.session()) {
            // 1. Check if DB is reachable
            Result healthResult = session.run("RETURN 1 AS ok");
            boolean isReachable = healthResult.hasNext() && healthResult.single().get("ok").asInt() == 1;
            response.put("isReachable", isReachable);

            // 2. Expected node labels exist
            Result labelsResult = session.run("CALL db.labels()");
            List<String> labels = labelsResult.list(r -> r.get(0).asString());
            response.put("nodeLabels", labels);

            // 3. Count seeded nodes
            Result countResult = session.run("MATCH (n) RETURN count(n) AS nodeCount");
            int nodeCount = countResult.single().get("nodeCount").asInt();
            response.put("nodeCount", nodeCount);

            // 4. Count relationships
            Result relCountResult = session.run("MATCH ()-[r]->() RETURN count(r) AS relCount");
            int relCount = relCountResult.single().get("relCount").asInt();
            response.put("relationshipCount", relCount);

            // 5. Multi-hop query result
            String multiHopQuery = 
                "MATCH (p:Person {name: 'Alice'})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(r:Role)<-[:OFFERS_ROLE]-(c:Company) " +
                "RETURN p.name AS Person, s.name AS MatchedSkill, r.title AS Role, c.name AS Company LIMIT 5";
            Result multiHopResult = session.run(multiHopQuery);
            List<Map<String, Object>> multiHopData = multiHopResult.list(r -> r.asMap());
            response.put("multiHopSample", multiHopData);

            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Verification failed.", e);
            response.put("status", "ERROR");
            response.put("message", "Database verification failed.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    private String loadCypher(String path) throws Exception {
        ClassPathResource resource = new ClassPathResource(path);
        return StreamUtils.copyToString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    private void executeCypherStatements(Session session, String content) {
        // Simple splitting by semicolon for basic statements.
        // It ignores empty lines or comments
        String[] statements = content.split(";");
        for (String stmt : statements) {
            String trimmed = stmt.trim();
            if (!trimmed.isEmpty()) {
                session.run(trimmed);
            }
        }
    }
}
