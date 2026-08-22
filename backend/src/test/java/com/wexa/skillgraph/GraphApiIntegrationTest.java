package com.wexa.skillgraph;

import org.junit.jupiter.api.Test;
import org.neo4j.driver.Driver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class GraphApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private Driver driver;

    @Test
    public void testHealthEndpoint() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk());
    }

    @Test
    public void testHealthDbEndpoint() throws Exception {
        // Driver is mocked, so an exception would be thrown in HealthController if we don't mock the Session.
        // It should return 503 Service Unavailable since driver throws NPE or Mockito default null for session.
        mockMvc.perform(get("/api/health/db"))
                .andExpect(status().isServiceUnavailable());
    }
    
    @Test
    public void testPeopleEndpoint() throws Exception {
        org.neo4j.driver.Session session = org.mockito.Mockito.mock(org.neo4j.driver.Session.class);
        org.neo4j.driver.Result result = org.mockito.Mockito.mock(org.neo4j.driver.Result.class);
        org.mockito.Mockito.when(driver.session()).thenReturn(session);
        org.mockito.Mockito.when(session.run(org.mockito.ArgumentMatchers.anyString())).thenReturn(result);
        org.mockito.Mockito.when(result.list(org.mockito.ArgumentMatchers.any())).thenReturn(java.util.List.of());

        mockMvc.perform(get("/api/people"))
                .andExpect(status().isOk());
    }

    @Test
    public void testInvalidSearchEndpoint() throws Exception {
        // Missing skill/technology
        mockMvc.perform(get("/api/people/search"))
                .andExpect(status().isBadRequest());
    }
}
