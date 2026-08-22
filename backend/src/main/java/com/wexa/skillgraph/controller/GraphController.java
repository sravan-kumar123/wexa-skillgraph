package com.wexa.skillgraph.controller;

import com.wexa.skillgraph.dto.*;
import com.wexa.skillgraph.service.GraphService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class GraphController {

    private final GraphService graphService;

    public GraphController(GraphService graphService) {
        this.graphService = graphService;
    }

    @GetMapping("/people")
    public ResponseEntity<List<PersonResponse>> getAllPeople() {
        return ResponseEntity.ok(graphService.getAllPeople());
    }

    @GetMapping("/people/{id}")
    public ResponseEntity<PersonDetailResponse> getPersonById(@PathVariable String id) {
        return ResponseEntity.ok(graphService.getPersonById(id));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<SkillResponse>> getAllSkills() {
        return ResponseEntity.ok(graphService.getAllSkills());
    }

    @GetMapping("/technologies")
    public ResponseEntity<List<TechnologyResponse>> getAllTechnologies() {
        return ResponseEntity.ok(graphService.getAllTechnologies());
    }

    @GetMapping("/domains")
    public ResponseEntity<List<DomainResponse>> getAllDomains() {
        return ResponseEntity.ok(graphService.getAllDomains());
    }

    @GetMapping("/roles")
    public ResponseEntity<List<RoleResponse>> getAllRoles() {
        return ResponseEntity.ok(graphService.getAllRoles());
    }

    @GetMapping("/companies")
    public ResponseEntity<List<CompanyResponse>> getAllCompanies() {
        return ResponseEntity.ok(graphService.getAllCompanies());
    }

    @GetMapping("/people/search")
    public ResponseEntity<List<PersonResponse>> searchPeople(
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) String technology) {
        
        if (skill != null && !skill.isBlank()) {
            return ResponseEntity.ok(graphService.searchPeopleBySkill(skill));
        } else if (technology != null && !technology.isBlank()) {
            return ResponseEntity.ok(graphService.searchPeopleByTechnology(technology));
        }
        
        return ResponseEntity.badRequest().build();
    }

    @GetMapping("/roles/{id}/requirements")
    public ResponseEntity<RoleRequirementsResponse> getRoleRequirements(@PathVariable String id) {
        return ResponseEntity.ok(graphService.getRoleRequirements(id));
    }

    @GetMapping("/companies/{id}/roles")
    public ResponseEntity<CompanyDetailResponse> getCompanyRoles(@PathVariable String id) {
        return ResponseEntity.ok(graphService.getCompanyRoles(id));
    }

    @GetMapping("/domains/{id}")
    public ResponseEntity<DomainDetailResponse> getDomainDetails(@PathVariable String id) {
        return ResponseEntity.ok(graphService.getDomainDetails(id));
    }

    @GetMapping("/graph/recommendations/{personId}")
    public ResponseEntity<RecommendationResponse> getRecommendations(@PathVariable String personId) {
        return ResponseEntity.ok(graphService.getRecommendations(personId));
    }

    @GetMapping("/search")
    public ResponseEntity<SearchResponse> searchGraph(@RequestParam String q) {
        return ResponseEntity.ok(graphService.search(q));
    }
}
