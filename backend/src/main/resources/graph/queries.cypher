// A. List all people and their skills.
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill)
RETURN p.name AS Person, collect(s.name) AS Skills;

// B. Find people who have a specific skill.
MATCH (p:Person)-[:HAS_SKILL]->(s:Skill {name: 'Java Development'})
RETURN p.name AS Person;

// C. Find people who know a specific technology.
MATCH (p:Person)-[:KNOWS_TECHNOLOGY]->(t:Technology {name: 'Spring Boot'})
RETURN p.name AS Person;

// D. Find skills required for a specific role.
MATCH (r:Role {title: 'Backend Engineer'})-[:REQUIRES_SKILL]->(s:Skill)
RETURN s.name AS RequiredSkills;

// E. Find technologies associated with a specific domain.
MATCH (t:Technology)-[:USED_IN]->(d:Domain {name: 'Software Engineering'})
RETURN t.name AS Technologies;

// F. Find companies offering a specific role.
MATCH (c:Company)-[:OFFERS_ROLE]->(r:Role {title: 'DevOps Engineer'})
RETURN c.name AS Company;

// G. Perform a MULTI-HOP traversal.
// Business question: Find which companies offer a role that requires a skill held by a specific person (e.g., Alice).
// Traversal: Person -> HAS_SKILL -> Skill <- REQUIRES_SKILL <- Role <- OFFERS_ROLE <- Company
MATCH (p:Person {name: 'Alice'})-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES_SKILL]-(r:Role)<-[:OFFERS_ROLE]-(c:Company)
RETURN p.name AS Person, s.name AS MatchedSkill, r.title AS Role, c.name AS Company;

// G. Alternative MULTI-HOP traversal.
// Business question: Find technologies used in a domain that a person is interested in (via the roles they are interested in).
// Traversal: Person -> INTERESTED_IN -> Role -> REQUIRES_TECHNOLOGY -> Technology -> USED_IN -> Domain
MATCH (p:Person {name: 'Bob'})-[:INTERESTED_IN]->(r:Role)-[:REQUIRES_TECHNOLOGY]->(t:Technology)-[:USED_IN]->(d:Domain)
RETURN p.name AS Person, r.title AS InterestedRole, t.name AS Technology, d.name AS Domain;
