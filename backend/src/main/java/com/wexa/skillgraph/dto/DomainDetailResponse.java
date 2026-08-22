package com.wexa.skillgraph.dto;
import java.util.List;

public record DomainDetailResponse(DomainResponse domain, List<TechnologyResponse> technologies, List<SkillResponse> skills) {}
