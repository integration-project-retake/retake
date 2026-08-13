package be.ucll.retake.dto;


import java.time.Instant;

import be.ucll.retake.model.User;
public record UserDto(Long id, String username, String email, String avatarUrl,
                      String bio, Instant createdAt) {
    public static UserDto from(User user) {
        return new UserDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getAvatarUrl(),
                user.getBio(),
                user.getCreatedAt()
        );
    }
}