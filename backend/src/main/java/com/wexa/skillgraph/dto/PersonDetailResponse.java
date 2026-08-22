package com.wexa.skillgraph.dto;
import java.util.List;

public record PersonDetailResponse(PersonResponse person, List<SkillResponse> skills, List<TechnologyResponse> technologies) {}
