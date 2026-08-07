package be.ucll.retake.model;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class GameTest {

    private static Validator validator;

    @BeforeAll
    static void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void givenValidValues_whenCreatingGame_thenGameIsCreated() {
        Game game = new Game(570, "Dota 2");

        assertEquals(570, game.getSteamAppid());
        assertEquals("Dota 2", game.getName());
    }

    @Test
    void givenValidValues_whenValidatingGame_thenNoViolations() {
        Game game = new Game(570, "Dota 2");

        Set<ConstraintViolation<Game>> violations = validator.validate(game);

        assertTrue(violations.isEmpty());
    }

    @Test
    void givenNullSteamAppid_whenValidatingGame_thenViolationIsReturned() {
        Game game = new Game(null, "Dota 2");

        Set<ConstraintViolation<Game>> violations = validator.validate(game);

        assertEquals(1, violations.size());
        assertEquals("Steam appid is required", violations.iterator().next().getMessage());
    }

    @Test
    void givenNullName_whenValidatingGame_thenViolationIsReturned() {
        Game game = new Game(570, null);

        Set<ConstraintViolation<Game>> violations = validator.validate(game);

        assertEquals(1, violations.size());
    }
}