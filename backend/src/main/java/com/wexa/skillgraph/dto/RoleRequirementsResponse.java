package com.wexa.skillgraph.dto;
import java.util.List;

public record RoleRequirementsResponse(RoleResponse role, List<SkillResponse> skills, List<TechnologyResponse> technologies) {}
