package be.ucll.retake.dto;

import be.ucll.retake.model.Game;

import java.time.Instant;

public record GameDto(Long id, Integer steamAppid, String name, Instant createdAt) {

    public static GameDto from(Game game) {
        return new GameDto(
                game.getId(),
                game.getSteamAppid(),
                game.getName(),
                game.getCreatedAt()
        );
    }
}