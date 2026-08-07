package be.ucll.retake.dto;

import be.ucll.retake.model.Game;

import java.time.Instant;

public record GameDto(Long id, Integer steamAppid, String name, String headerUrl, Instant createdAt, String tier) {

    public static GameDto from(Game game, String tier) {
        String headerUrl = "https://cdn.cloudflare.steamstatic.com/steam/apps/" + game.getSteamAppid() +"/header.jpg";
        return new GameDto(
                game.getId(),
                game.getSteamAppid(),
                game.getName(),
                headerUrl,
                game.getCreatedAt(),
                tier
        );
    }
}
