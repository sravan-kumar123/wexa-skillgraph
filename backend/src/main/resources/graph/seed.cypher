// Seed Domains
MERGE (d1:Domain {id: 'dom-1'}) ON CREATE SET d1.name = 'CyberSecurity'
MERGE (d2:Domain {id: 'dom-2'}) ON CREATE SET d2.name = 'Cloud Computing'
MERGE (d3:Domain {id: 'dom-3'}) ON CREATE SET d3.name = 'Software Engineering'
MERGE (d4:Domain {id: 'dom-4'}) ON CREATE SET d4.name = 'DevOps'
MERGE (d5:Domain {id: 'dom-5'}) ON CREATE SET d5.name = 'Data Science';

// Seed Technologies
MERGE (t1:Technology {id: 'tech-1'}) ON CREATE SET t1.name = 'Spring Boot', t1.category = 'Framework'
MERGE (t2:Technology {id: 'tech-2'}) ON CREATE SET t2.name = 'React', t2.category = 'Library'
MERGE (t3:Technology {id: 'tech-3'}) ON CREATE SET t3.name = 'Python', t3.category = 'Language'
MERGE (t4:Technology {id: 'tech-4'}) ON CREATE SET t4.name = 'AWS', t4.category = 'Cloud Platform'
MERGE (t5:Technology {id: 'tech-5'}) ON CREATE SET t5.name = 'Docker', t5.category = 'Tool'
MERGE (t6:Technology {id: 'tech-6'}) ON CREATE SET t6.name = 'Kubernetes', t6.category = 'Tool'
MERGE (t7:Technology {id: 'tech-7'}) ON CREATE SET t7.name = 'Neo4j', t7.category = 'Database'
MERGE (t8:Technology {id: 'tech-8'}) ON CREATE SET t8.name = 'Metasploit', t8.category = 'Tool';

// Seed Skills
MERGE (s1:Skill {id: 'skill-1'}) ON CREATE SET s1.name = 'Java Development', s1.category = 'Development'
MERGE (s2:Skill {id: 'skill-2'}) ON CREATE SET s2.name = 'Frontend Architecture', s2.category = 'Design'
MERGE (s3:Skill {id: 'skill-3'}) ON CREATE SET s3.name = 'Python Scripting', s3.category = 'Development'
MERGE (s4:Skill {id: 'skill-4'}) ON CREATE SET s4.name = 'Cloud Architecture', s4.category = 'Design'
MERGE (s5:Skill {id: 'skill-5'}) ON CREATE SET s5.name = 'Containerization', s5.category = 'Operations'
MERGE (s6:Skill {id: 'skill-6'}) ON CREATE SET s6.name = 'Penetration Testing', s6.category = 'Security'
MERGE (s7:Skill {id: 'skill-7'}) ON CREATE SET s7.name = 'Graph Databases', s7.category = 'Data'
MERGE (s8:Skill {id: 'skill-8'}) ON CREATE SET s8.name = 'Web Security', s8.category = 'Security'
MERGE (s9:Skill {id: 'skill-9'}) ON CREATE SET s9.name = 'CI/CD Pipelines', s9.category = 'Operations'
MERGE (s10:Skill {id: 'skill-10'}) ON CREATE SET s10.name = 'Incident Response', s10.category = 'Security';

// Seed Persons
MERGE (p1:Person {id: 'p-1'}) ON CREATE SET p1.name = 'Alice', p1.email = 'alice@example.com'
MERGE (p2:Person {id: 'p-2'}) ON CREATE SET p2.name = 'Bob', p2.email = 'bob@example.com'
MERGE (p3:Person {id: 'p-3'}) ON CREATE SET p3.name = 'Charlie', p3.email = 'charlie@example.com'
MERGE (p4:Person {id: 'p-4'}) ON CREATE SET p4.name = 'Diana', p4.email = 'diana@example.com'
MERGE (p5:Person {id: 'p-5'}) ON CREATE SET p5.name = 'Eve', p5.email = 'eve@example.com';

// Seed Roles
MERGE (r1:Role {id: 'role-1'}) ON CREATE SET r1.title = 'Backend Engineer', r1.level = 'Mid'
MERGE (r2:Role {id: 'role-2'}) ON CREATE SET r2.title = 'Frontend Developer', r2.level = 'Junior'
MERGE (r3:Role {id: 'role-3'}) ON CREATE SET r3.title = 'Cloud Architect', r3.level = 'Senior'
MERGE (r4:Role {id: 'role-4'}) ON CREATE SET r4.title = 'DevOps Engineer', r4.level = 'Mid'
MERGE (r5:Role {id: 'role-5'}) ON CREATE SET r5.title = 'Security Analyst', r5.level = 'Junior'
MERGE (r6:Role {id: 'role-6'}) ON CREATE SET r6.title = 'Penetration Tester', r6.level = 'Senior';

// Seed Companies
MERGE (c1:Company {id: 'comp-1'}) ON CREATE SET c1.name = 'CyberShield Inc', c1.industry = 'Cybersecurity'
MERGE (c2:Company {id: 'comp-2'}) ON CREATE SET c2.name = 'CloudNative Corp', c2.industry = 'Technology'
MERGE (c3:Company {id: 'comp-3'}) ON CREATE SET c3.name = 'FinTech Innovations', c3.industry = 'Finance'
MERGE (c4:Company {id: 'comp-4'}) ON CREATE SET c4.name = 'Global Logistics', c4.industry = 'Supply Chain';

// Relationships - MATCH then MERGE to avoid duplicates
MATCH (p:Person {id: 'p-1'}), (s1:Skill {id: 'skill-1'}), (s4:Skill {id: 'skill-4'})
MERGE (p)-[:HAS_SKILL]->(s1)
MERGE (p)-[:HAS_SKILL]->(s4);

MATCH (p:Person {id: 'p-2'}), (s6:Skill {id: 'skill-6'}), (s8:Skill {id: 'skill-8'})
MERGE (p)-[:HAS_SKILL]->(s6)
MERGE (p)-[:HAS_SKILL]->(s8);

MATCH (p:Person {id: 'p-3'}), (s2:Skill {id: 'skill-2'}), (s9:Skill {id: 'skill-9'})
MERGE (p)-[:HAS_SKILL]->(s2)
MERGE (p)-[:HAS_SKILL]->(s9);

MATCH (p:Person {id: 'p-4'}), (s3:Skill {id: 'skill-3'}), (s10:Skill {id: 'skill-10'})
MERGE (p)-[:HAS_SKILL]->(s3)
MERGE (p)-[:HAS_SKILL]->(s10);

MATCH (p:Person {id: 'p-5'}), (s5:Skill {id: 'skill-5'}), (s7:Skill {id: 'skill-7'})
MERGE (p)-[:HAS_SKILL]->(s5)
MERGE (p)-[:HAS_SKILL]->(s7);

MATCH (p:Person {id: 'p-1'}), (t1:Technology {id: 'tech-1'}), (t4:Technology {id: 'tech-4'})
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t1)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t4);

MATCH (p:Person {id: 'p-2'}), (t8:Technology {id: 'tech-8'}), (t3:Technology {id: 'tech-3'})
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t8)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t3);

MATCH (p:Person {id: 'p-3'}), (t2:Technology {id: 'tech-2'}), (t5:Technology {id: 'tech-5'})
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t2)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t5);

MATCH (p:Person {id: 'p-4'}), (t3:Technology {id: 'tech-3'}), (t4:Technology {id: 'tech-4'})
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t3)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t4);

MATCH (p:Person {id: 'p-5'}), (t5:Technology {id: 'tech-5'}), (t6:Technology {id: 'tech-6'}), (t7:Technology {id: 'tech-7'})
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t5)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t6)
MERGE (p)-[:KNOWS_TECHNOLOGY]->(t7);

MATCH (s:Skill {id: 'skill-1'}), (t:Technology {id: 'tech-1'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-2'}), (t:Technology {id: 'tech-2'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-3'}), (t:Technology {id: 'tech-3'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-4'}), (t:Technology {id: 'tech-4'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-5'}), (t:Technology {id: 'tech-5'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-5'}), (t:Technology {id: 'tech-6'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-6'}), (t:Technology {id: 'tech-8'}) MERGE (s)-[:RELATED_TO]->(t);
MATCH (s:Skill {id: 'skill-7'}), (t:Technology {id: 'tech-7'}) MERGE (s)-[:RELATED_TO]->(t);

MATCH (s:Skill {id: 'skill-1'}), (d:Domain {id: 'dom-3'}) MERGE (s)-[:IN_DOMAIN]->(d);
MATCH (s:Skill {id: 'skill-2'}), (d:Domain {id: 'dom-3'}) MERGE (s)-[:IN_DOMAIN]->(d);
MATCH (s:Skill {id: 'skill-4'}), (d:Domain {id: 'dom-2'}) MERGE (s)-[:IN_DOMAIN]->(d);
MATCH (s:Skill {id: 'skill-5'}), (d:Domain {id: 'dom-4'}) MERGE (s)-[:IN_DOMAIN]->(d);
MATCH (s:Skill {id: 'skill-6'}), (d:Domain {id: 'dom-1'}) MERGE (s)-[:IN_DOMAIN]->(d);
MATCH (s:Skill {id: 'skill-7'}), (d:Domain {id: 'dom-3'}) MERGE (s)-[:IN_DOMAIN]->(d);

MATCH (t:Technology {id: 'tech-1'}), (d:Domain {id: 'dom-3'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-2'}), (d:Domain {id: 'dom-3'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-3'}), (d:Domain {id: 'dom-5'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-4'}), (d:Domain {id: 'dom-2'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-5'}), (d:Domain {id: 'dom-4'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-6'}), (d:Domain {id: 'dom-4'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-7'}), (d:Domain {id: 'dom-3'}) MERGE (t)-[:USED_IN]->(d);
MATCH (t:Technology {id: 'tech-8'}), (d:Domain {id: 'dom-1'}) MERGE (t)-[:USED_IN]->(d);

MATCH (r:Role {id: 'role-1'}), (s:Skill {id: 'skill-1'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-1'}), (t:Technology {id: 'tech-1'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (r:Role {id: 'role-2'}), (s:Skill {id: 'skill-2'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-2'}), (t:Technology {id: 'tech-2'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (r:Role {id: 'role-3'}), (s:Skill {id: 'skill-4'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-3'}), (t:Technology {id: 'tech-4'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (r:Role {id: 'role-4'}), (s:Skill {id: 'skill-5'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-4'}), (t:Technology {id: 'tech-5'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);
MATCH (r:Role {id: 'role-4'}), (t:Technology {id: 'tech-6'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (r:Role {id: 'role-5'}), (s:Skill {id: 'skill-10'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-5'}), (t:Technology {id: 'tech-3'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (r:Role {id: 'role-6'}), (s:Skill {id: 'skill-6'}) MERGE (r)-[:REQUIRES_SKILL]->(s);
MATCH (r:Role {id: 'role-6'}), (t:Technology {id: 'tech-8'}) MERGE (r)-[:REQUIRES_TECHNOLOGY]->(t);

MATCH (c:Company {id: 'comp-1'}), (r:Role {id: 'role-6'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-1'}), (r:Role {id: 'role-5'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-2'}), (r:Role {id: 'role-3'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-2'}), (r:Role {id: 'role-4'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-3'}), (r:Role {id: 'role-1'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-3'}), (r:Role {id: 'role-2'}) MERGE (c)-[:OFFERS_ROLE]->(r);
MATCH (c:Company {id: 'comp-4'}), (r:Role {id: 'role-4'}) MERGE (c)-[:OFFERS_ROLE]->(r);

MATCH (p:Person {id: 'p-1'}), (r:Role {id: 'role-3'}) MERGE (p)-[:INTERESTED_IN]->(r);
MATCH (p:Person {id: 'p-2'}), (r:Role {id: 'role-6'}) MERGE (p)-[:INTERESTED_IN]->(r);
MATCH (p:Person {id: 'p-3'}), (r:Role {id: 'role-1'}) MERGE (p)-[:INTERESTED_IN]->(r);
MATCH (p:Person {id: 'p-4'}), (r:Role {id: 'role-5'}) MERGE (p)-[:INTERESTED_IN]->(r);
MATCH (p:Person {id: 'p-5'}), (r:Role {id: 'role-4'}) MERGE (p)-[:INTERESTED_IN]->(r);
