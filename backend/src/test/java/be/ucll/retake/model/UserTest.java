package be.ucll.retake.model;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.Set;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;

public class UserTest {
    
    private static Validator validator;

    @BeforeAll
    static void setup() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }
    @Test
    void givenValidValues_whenCreatingUser_thenUserIsCreated() {
        User user = new User("annie", "annie@ucll.be", "kleinkunst67");

        assertEquals("annie", user.getUsername());
        assertEquals("annie@ucll.be", user.getEmail());
        assertEquals("kleinkunst67", user.getPassword());
    }


    @Test
    void givenInvalidValues_whenCreatingUser_thenReturnError() {

        User user = new User("annie", "random=w=", "kleinkunst67");

        Set<ConstraintViolation<User>> violations = validator.validate(user);

        assertEquals(1, violations.size());
        assertEquals("Email must be in a valid format", violations.iterator().next().getMessage());
    
    }
}
