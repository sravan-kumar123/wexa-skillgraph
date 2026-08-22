package com.wexa.skillgraph.dto;
import java.util.List;

public record CompanyDetailResponse(CompanyResponse company, List<RoleResponse> roles) {}
