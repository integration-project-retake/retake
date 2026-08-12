package be.ucll.retake.integration;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;
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
public class ReportIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GameRepository gameRepository;

    @Autowired
    private jakarta.persistence.EntityManager entityManager;

    private User user;
    private Game game;

    @BeforeEach
    public void setup() {
        reportRepository.deleteAll();
        userRepository.deleteAll();
        gameRepository.deleteAll();

        user = userRepository.save(new User("anh", "anh@ucll.be", "password123"));
        game = gameRepository.save(new Game(570, "Dota 2"));
    }

    @Test
    public void givenUserAndGame_whenCreatingReport_thenReportIsSaved() throws Exception {
        mockMvc.perform(post("/reports")
                        .param("userId", user.getId().toString())
                        .param("gameId", game.getId().toString())
                        .param("tier", "Gold")
                        .param("distribution", "Ubuntu")
                        .param("comment", "test")
                        .param("protonVersion", "version"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tier").value("Gold"))
                .andExpect(jsonPath("$.distribution").value("Ubuntu"));

        assertEquals(1, reportRepository.count());
    }

    @Test
    public void givenReportsForGame_whenGettingBySteamAppid_thenReportsReturned() throws Exception {
        reportRepository.save(new Report(user, game, Tier.Gold, "Ubuntu"));
        reportRepository.save(new Report(user, game, Tier.Platinum, "SteamOS"));

        mockMvc.perform(get("/reports/steam/570"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
        public void givenGameHasReports_whenGameIsDeleted_thenReportsAreDeleted() throws Exception {
            Game testGame = gameRepository.save(new Game(1111, "Test Game"));
            reportRepository.save(new Report(user, testGame, Tier.Gold, "Ubuntu"));
            reportRepository.save(new Report(user, testGame, Tier.Platinum, "SteamOS"));

            entityManager.flush();
            entityManager.clear();

            assertEquals(2, reportRepository.count());

            gameRepository.deleteById(testGame.getId());

            entityManager.flush();
            entityManager.clear();

            assertEquals(0, reportRepository.count());
        }

    @Test
    public void givenInvalidTier_whenCreatingReport_thenBadRequest() throws Exception {
        mockMvc.perform(post("/reports")
                        .param("userId", user.getId().toString())
                        .param("gameId", game.getId().toString())
                        .param("tier", "Diamond")
                        .param("distribution", "Ubuntu"))
                .andExpect(status().isBadRequest());
    }
}
