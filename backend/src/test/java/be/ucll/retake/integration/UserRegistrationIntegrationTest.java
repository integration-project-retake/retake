package be.ucll.retake.integration;

import be.ucll.retake.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
public class UserRegistrationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        userRepository.deleteAll();
    }

    @Test
    public void givenValidUser_whenRegistering_thenUserIsSavedToDatabase() throws Exception {
        String newUser = """
            {
                "username": "jamesbrown",
                "email": "jamesbrown@gmail.com",
                "password": "SecurePassword123!"
            }
            """;

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newUser))
                .andExpect(status().isCreated());

        assertTrue(userRepository.findByUsername("jamesbrown").isPresent());
        assertEquals("jamesbrown@gmail.com",
                userRepository.findByUsername("jamesbrown").get().getEmail());
    }

    @Test
    public void givenPasswordStored_whenRegistering_thenPasswordIsHashed() throws Exception {
        String newUser = """
            {
                "username": "hashcheck",
                "email": "hash@gmail.com",
                "password": "PlainPassword123"
            }
            """;

        mockMvc.perform(post("/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(newUser))
                .andExpect(status().isCreated());

        String stored = userRepository.findByUsername("hashcheck").get().getPassword();
        assertTrue(stored.startsWith("$2a$"));  // BCrypt prefix, not plaintext
    }
}
