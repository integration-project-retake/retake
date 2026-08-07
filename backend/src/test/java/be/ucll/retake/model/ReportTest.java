package be.ucll.retake.model;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class ReportTest {

    @Test
    void givenValidValues_whenCreatingReport_thenReportIsCreated() {
        User user = new User("anh", "anh@ucll.be", "password123");
        Game game = new Game(570, "Dota 2");

        Report report = new Report(user, game, Tier.Gold, "Ubuntu");

        assertEquals(user, report.getUser());
        assertEquals(game, report.getGame());
        assertEquals(Tier.Gold, report.getTier());
        assertEquals("Ubuntu", report.getDistro());
    }

    @Test
    void givenReport_whenChangingTier_thenTierIsUpdated() {
        User user = new User("anh", "anh@ucll.be", "password123");
        Game game = new Game(570, "Dota 2");
        Report report = new Report(user, game, Tier.Gold, "Ubuntu");

        report.setTier(Tier.Platinum);

        assertEquals(Tier.Platinum, report.getTier());
    }
}