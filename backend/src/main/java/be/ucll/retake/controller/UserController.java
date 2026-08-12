package be.ucll.retake.controller;

import be.ucll.retake.model.User;
import be.ucll.retake.dto.UserDto;
import be.ucll.retake.dto.LoginRequest;
import be.ucll.retake.dto.UserInput;
import be.ucll.retake.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(
            UserService userService
    ) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDto> getAllUsers() {
        return userService
                .getAllUsers()
                .stream()
                .map(UserDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public UserDto getUserById(
            @PathVariable Long id
    ) {
        return UserDto.from(
                userService.getUserById(id)
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto createUser(
            @Valid @RequestBody UserInput input
    ) {
        return UserDto.from(
                userService.createUser(
                        input.username(),
                        input.email(),
                        input.password()
                )
        );
    }

    @PostMapping("/login")
    public UserDto login(
            @Valid @RequestBody LoginRequest credentials,
            HttpServletRequest request
    ) {
        try {
            User user =
                    userService.authenticate(
                            credentials.username(),
                            credentials.password()
                    );

            HttpSession session =
                    request.getSession(true);

            session.setAttribute(
                    "user",
                    user
            );

            return UserDto.from(user);

        } catch (RuntimeException e) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Invalid credentials"
            );
        }
    }

    @GetMapping("/me")
    public UserDto getCurrentUser(
            HttpServletRequest request
    ) {
        HttpSession session =
                request.getSession(false);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not authenticated"
            );
        }

        Object sessionUser =
                session.getAttribute("user");

        if (!(sessionUser instanceof User user)) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Not authenticated"
            );
        }

        User freshUser =
                userService.getUserById(
                        user.getId()
                );

        session.setAttribute(
                "user",
                freshUser
        );

        return UserDto.from(
                freshUser
        );
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(
            HttpServletRequest request
    ) {
        HttpSession session =
                request.getSession(false);

        if (session != null) {
            session.invalidate();
        }
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public UserDto register(
            @Valid @RequestBody UserInput input
    ) {
        return UserDto.from(
                userService.createUser(
                        input.username(),
                        input.email(),
                        input.password()
                )
        );
    }

    @PatchMapping("/{id}/avatar")
    public UserDto updateAvatar(
            @PathVariable Long id,
            @RequestParam String avatarUrl,
            HttpServletRequest request
    ) {
        User updatedUser =
                userService.updateAvatar(
                        id,
                        avatarUrl
                );

        HttpSession session =
                request.getSession(false);

        if (session != null) {
            Object sessionUser =
                    session.getAttribute("user");

            if (
                    sessionUser instanceof User user &&
                            user.getId().equals(id)
            ) {
                session.setAttribute(
                        "user",
                        updatedUser
                );
            }
        }

        return UserDto.from(
                updatedUser
        );
    }
}