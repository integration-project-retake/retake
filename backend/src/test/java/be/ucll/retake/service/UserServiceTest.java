package be.ucll.retake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import be.ucll.retake.model.User;
import be.ucll.retake.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private UserService userService;

    @BeforeEach
    void setup() {
        userService = new UserService(
                userRepository,
                passwordEncoder
        );
    }

    @Test
    void givenUsers_whenGettingAllUsers_thenReturnAllUsers() {
        User user1 = new User(
                "annie",
                "annie@ucll.be",
                "password1"
        );

        User user2 = new User(
                "sundae",
                "sundae@ucll.be",
                "password2"
        );

        when(userRepository.findAll())
                .thenReturn(List.of(user1, user2));

        List<User> result =
                userService.getAllUsers();

        assertEquals(2, result.size());
        assertSame(user1, result.get(0));
        assertSame(user2, result.get(1));
    }

    @Test
    void givenExistingUserId_whenGettingUserById_thenReturnUser() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result =
                userService.getUserById(1L);

        assertSame(user, result);
    }

    @Test
    void givenUnknownUserId_whenGettingUserById_thenThrowError() {
        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.getUserById(99L)
                );

        assertEquals(
                "User with id 99 not found",
                exception.getMessage()
        );
    }

    @Test
    void givenValidUserData_whenCreatingUser_thenEncodePasswordAndSaveUser() {
        when(userRepository.existsByUsername("annie"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("hashedPassword");

        User savedUser = new User(
                "annie",
                "annie@ucll.be",
                "hashedPassword"
        );

        when(userRepository.save(org.mockito.ArgumentMatchers.any(User.class)))
                .thenReturn(savedUser);

        User result =
                userService.createUser(
                        "annie",
                        "annie@ucll.be",
                        "password123"
                );

        assertSame(savedUser, result);

        verify(passwordEncoder)
                .encode("password123");

        verify(userRepository)
                .save(org.mockito.ArgumentMatchers.any(User.class));
    }

    @Test
    void givenExistingUsername_whenCreatingUser_thenThrowError() {
        when(userRepository.existsByUsername("annie"))
                .thenReturn(true);

        IllegalArgumentException exception =
                assertThrows(
                        IllegalArgumentException.class,
                        () -> userService.createUser(
                                "annie",
                                "annie@ucll.be",
                                "password123"
                        )
                );

        assertEquals(
                "Username annie is already taken",
                exception.getMessage()
        );
    }

    @Test
    void givenValidCredentials_whenAuthenticating_thenReturnUser() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "hashedPassword"
        );

        when(userRepository.findByUsername("annie"))
                .thenReturn(Optional.of(user));

        when(
                passwordEncoder.matches(
                        "password123",
                        "hashedPassword"
                )
        ).thenReturn(true);

        User result =
                userService.authenticate(
                        "annie",
                        "password123"
                );

        assertSame(user, result);
    }

    @Test
    void givenUnknownUsername_whenAuthenticating_thenThrowError() {
        when(userRepository.findByUsername("unknown"))
                .thenReturn(Optional.empty());

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.authenticate(
                                "unknown",
                                "password123"
                        )
                );

        assertEquals(
                "User not found",
                exception.getMessage()
        );
    }

    @Test
    void givenWrongPassword_whenAuthenticating_thenThrowError() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "hashedPassword"
        );

        when(userRepository.findByUsername("annie"))
                .thenReturn(Optional.of(user));

        when(
                passwordEncoder.matches(
                        "wrongPassword",
                        "hashedPassword"
                )
        ).thenReturn(false);

        RuntimeException exception =
                assertThrows(
                        RuntimeException.class,
                        () -> userService.authenticate(
                                "annie",
                                "wrongPassword"
                        )
                );

        assertEquals(
                "Invalid credentials",
                exception.getMessage()
        );
    }
}