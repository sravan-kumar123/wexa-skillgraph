package com.wexa.skillgraph.service;

import com.wexa.skillgraph.dto.*;
import com.wexa.skillgraph.exception.ResourceNotFoundException;
import org.neo4j.driver.Driver;
import org.neo4j.driver.Record;
import org.neo4j.driver.Session;
import org.neo4j.driver.types.Node;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GraphService {

    private final Driver driver;

    public GraphService(Driver driver) {
        this.driver = driver;
    }

    public List<PersonResponse> getAllPeople() {
        try (Session session = driver.session()) {
            return session.run("MATCH (p:Person) RETURN p").list(r -> mapPerson(r.get("p").asNode()));
        }
    }

    public PersonDetailResponse getPersonById(String id) {
        try (Session session = driver.session()) {
            var result = session.run("MATCH (p:Person {id: $id}) RETURN p", Map.of("id", id));
            if (!result.hasNext()) {
                throw new ResourceNotFoundException("Person not found");
            }
            PersonResponse person = mapPerson(result.single().get("p").asNode());

            List<SkillResponse> skills = session.run("MATCH (p:Person {id: $id})-[:HAS_SKILL]->(s:Skill) RETURN s", Map.of("id", id))
                    .list(r -> mapSkill(r.get("s").asNode()));

            List<TechnologyResponse> tech = session.run("MATCH (p:Person {id: $id})-[:KNOWS_TECHNOLOGY]->(t:Technology) RETURN t", Map.of("id", id))
                    .list(r -> mapTechnology(r.get("t").asNode()));

            return new PersonDetailResponse(person, skills, tech);
        }
    }

    public List<SkillResponse> getAllSkills() {
        try (Session session = driver.session()) {
            return session.run("MATCH (s:Skill) RETURN s").list(r -> mapSkill(r.get("s").asNode()));
        }
    }

    public List<TechnologyResponse> getAllTechnologies() {
        try (Session session = driver.session()) {
            return session.run("MATCH (t:Technology) RETURN t").list(r -> mapTechnology(r.get("t").asNode()));
        }
    }

    public List<DomainResponse> getAllDomains() {
        try (Session session = driver.session()) {
            return session.run("MATCH (d:Domain) RETURN d").list(r -> mapDomain(r.get("d").asNode()));
        }
    }

    public List<RoleResponse> getAllRoles() {
        try (Session session = driver.session()) {
            return session.run("MATCH (r:Role) RETURN r").list(r -> mapRole(r.get("r").asNode()));
        }
    }

    public List<CompanyResponse> getAllCompanies() {
        try (Session session = driver.session()) {
            return session.run("MATCH (c:Company) RETURN c").list(r -> mapCompany(r.get("c").asNode()));
        }
    }

    public List<PersonResponse> searchPeopleBySkill(String skillName) {
        if (skillName == null || skillName.isBlank()) return new ArrayList<>();
        try (Session session = driver.session()) {
            return session.run("MATCH (p:Person)-[:HAS_SKILL]->(s:Skill) WHERE toLower(s.name) CONTAINS toLower($skill) RETURN p", Map.of("skill", skillName.trim()))
                    .list(r -> mapPerson(r.get("p").asNode()));
        }
    }

    public List<PersonResponse> searchPeopleByTechnology(String techName) {
        if (techName == null || techName.isBlank()) return new ArrayList<>();
        try (Session session = driver.session()) {
            return session.run("MATCH (p:Person)-[:KNOWS_TECHNOLOGY]->(t:Technology) WHERE toLower(t.name) CONTAINS toLower($tech) RETURN p", Map.of("tech", techName.trim()))
                    .list(r -> mapPerson(r.get("p").asNode()));
        }
    }

    public RoleRequirementsResponse getRoleRequirements(String roleId) {
        try (Session session = driver.session()) {
            var result = session.run("MATCH (r:Role {id: $id}) RETURN r", Map.of("id", roleId));
            if (!result.hasNext()) {
                throw new ResourceNotFoundException("Role not found");
            }
            RoleResponse role = mapRole(result.single().get("r").asNode());

            List<SkillResponse> skills = session.run("MATCH (r:Role {id: $id})-[:REQUIRES_SKILL]->(s:Skill) RETURN s", Map.of("id", roleId))
                    .list(r -> mapSkill(r.get("s").asNode()));

            List<TechnologyResponse> tech = session.run("MATCH (r:Role {id: $id})-[:REQUIRES_TECHNOLOGY]->(t:Technology) RETURN t", Map.of("id", roleId))
                    .list(r -> mapTechnology(r.get("t").asNode()));

            return new RoleRequirementsResponse(role, skills, tech);
        }
    }

    public CompanyDetailResponse getCompanyRoles(String companyId) {
        try (Session session = driver.session()) {
            var check = session.run("MATCH (c:Company {id: $id}) RETURN c", Map.of("id", companyId));
            if (!check.hasNext()) throw new ResourceNotFoundException("Company not found");
            CompanyResponse company = mapCompany(check.single().get("c").asNode());
            
            List<RoleResponse> roles = session.run("MATCH (c:Company {id: $id})-[:OFFERS_ROLE]->(r:Role) RETURN r", Map.of("id", companyId))
                    .list(r -> mapRole(r.get("r").asNode()));
            return new CompanyDetailResponse(company, roles);
        }
    }

    public DomainDetailResponse getDomainDetails(String domainId) {
        try (Session session = driver.session()) {
            var result = session.run("MATCH (d:Domain {id: $id}) RETURN d", Map.of("id", domainId));
            if (!result.hasNext()) {
                throw new ResourceNotFoundException("Domain not found");
            }
            DomainResponse domain = mapDomain(result.single().get("d").asNode());

            List<SkillResponse> skills = session.run("MATCH (s:Skill)-[:IN_DOMAIN]->(d:Domain {id: $id}) RETURN s", Map.of("id", domainId))
                    .list(r -> mapSkill(r.get("s").asNode()));

            List<TechnologyResponse> tech = session.run("MATCH (t:Technology)-[:USED_IN]->(d:Domain {id: $id}) RETURN t", Map.of("id", domainId))
                    .list(r -> mapTechnology(r.get("t").asNode()));

            return new DomainDetailResponse(domain, tech, skills);
        }
    }

    public RecommendationResponse getRecommendations(String personId) {
        try (Session session = driver.session()) {
            var check = session.run("MATCH (p:Person {id: $id}) RETURN p", Map.of("id", personId));
            if (!check.hasNext()) throw new ResourceNotFoundException("Person not found");
            PersonResponse person = mapPerson(check.single().get("p").asNode());

            // Skills the person has
            List<SkillResponse> skills = session.run("MATCH (p:Person {id: $id})-[:HAS_SKILL]->(s:Skill) RETURN s", Map.of("id", personId))
                    .list(r -> mapSkill(r.get("s").asNode()));

            // Recommended Roles: Roles that require skills the person has
            List<RoleResponse> roles = session.run(
                    "MATCH (p:Person {id: $id})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(r:Role) RETURN DISTINCT r", Map.of("id", personId))
                    .list(r -> mapRole(r.get("r").asNode()));

            // Recommended Companies: Companies offering roles the person is interested in, or roles they match
            List<CompanyResponse> companies = session.run(
                    "MATCH (p:Person {id: $id})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(r:Role)<-[:OFFERS_ROLE]-(c:Company) RETURN DISTINCT c", Map.of("id", personId))
                    .list(r -> mapCompany(r.get("c").asNode()));

            return new RecommendationResponse(person, skills, roles, companies);
        }
    }

    public SearchResponse search(String query) {
        if (query == null || query.isBlank()) {
            return new SearchResponse(List.of(), List.of(), List.of(), List.of(), List.of(), List.of());
        }
        String q = query.trim().toLowerCase();
        try (Session session = driver.session()) {
            List<PersonResponse> people = session.run("MATCH (p:Person) WHERE toLower(p.name) CONTAINS $q RETURN p", Map.of("q", q)).list(r -> mapPerson(r.get("p").asNode()));
            List<SkillResponse> skills = session.run("MATCH (s:Skill) WHERE toLower(s.name) CONTAINS $q RETURN s", Map.of("q", q)).list(r -> mapSkill(r.get("s").asNode()));
            List<TechnologyResponse> tech = session.run("MATCH (t:Technology) WHERE toLower(t.name) CONTAINS $q RETURN t", Map.of("q", q)).list(r -> mapTechnology(r.get("t").asNode()));
            List<RoleResponse> roles = session.run("MATCH (r:Role) WHERE toLower(r.title) CONTAINS $q RETURN r", Map.of("q", q)).list(r -> mapRole(r.get("r").asNode()));
            List<CompanyResponse> companies = session.run("MATCH (c:Company) WHERE toLower(c.name) CONTAINS $q RETURN c", Map.of("q", q)).list(r -> mapCompany(r.get("c").asNode()));
            List<DomainResponse> domains = session.run("MATCH (d:Domain) WHERE toLower(d.name) CONTAINS $q RETURN d", Map.of("q", q)).list(r -> mapDomain(r.get("d").asNode()));
            return new SearchResponse(people, skills, tech, roles, companies, domains);
        }
    }

    private PersonResponse mapPerson(Node n) {
        return new PersonResponse(n.get("id").asString(), n.get("name").asString(), n.get("email").asString());
    }

    private SkillResponse mapSkill(Node n) {
        return new SkillResponse(n.get("id").asString(), n.get("name").asString(), n.get("category").asString(""));
    }

    private TechnologyResponse mapTechnology(Node n) {
        return new TechnologyResponse(n.get("id").asString(), n.get("name").asString(), n.get("category").asString(""));
    }

    private RoleResponse mapRole(Node n) {
        return new RoleResponse(n.get("id").asString(), n.get("title").asString(), n.get("level").asString(""));
    }

    private CompanyResponse mapCompany(Node n) {
        return new CompanyResponse(n.get("id").asString(), n.get("name").asString(), n.get("industry").asString(""));
    }

    private DomainResponse mapDomain(Node n) {
        return new DomainResponse(n.get("id").asString(), n.get("name").asString());
    }
}
