package com.wexa.skillgraph.dto;
import java.util.List;

public record SearchResponse(List<PersonResponse> people, List<SkillResponse> skills, List<TechnologyResponse> technologies, List<RoleResponse> roles, List<CompanyResponse> companies, List<DomainResponse> domains) {}
