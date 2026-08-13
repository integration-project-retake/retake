package be.ucll.retake.integration;

import be.ucll.retake.model.Game;
import be.ucll.retake.repository.GameRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
@Transactional
public class GameIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private GameRepository gameRepository;

    @BeforeEach
    public void setup() {
        gameRepository.deleteAll();
    }

    @Test
    public void givenValidGame_whenCreating_thenGameIsSaved() throws Exception {
        mockMvc.perform(post("/games")
                        .param("steamAppid", "2495100")
                        .param("name", "Hello Kitty Island Adventure"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Hello Kitty Island Adventure"))
                .andExpect(jsonPath("$.steamAppid").value(2495100));

        assertTrue(gameRepository.findBySteamAppid(2495100).isPresent());
    }

    @Test
    public void givenGamesExist_whenGettingAll_thenGamesAreReturned() throws Exception {
        gameRepository.save(new Game(570, "Dota 2"));
        gameRepository.save(new Game(1145360, "Hades"));

        mockMvc.perform(get("/games"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    public void givenGameExists_whenGettingById_thenGameIsReturned() throws Exception {
        Game saved = gameRepository.save(new Game(570, "Dota 2"));

        mockMvc.perform(get("/games/" + saved.getSteamAppid()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Dota 2"));
    }
}
