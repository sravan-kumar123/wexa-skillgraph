package com.wexa.skillgraph.dto;
import java.util.List;

public record RecommendationResponse(PersonResponse person, List<SkillResponse> skills, List<RoleResponse> roles, List<CompanyResponse> companies) {}
