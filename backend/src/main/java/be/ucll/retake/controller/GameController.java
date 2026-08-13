package be.ucll.retake.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.retake.dto.GameDto;
import be.ucll.retake.model.Game;
import be.ucll.retake.service.GameService;
import be.ucll.retake.service.SteamService;

@RestController
@RequestMapping("/games")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://127.0.0.1:3000"
        }
)
public class GameController {

    private final GameService gameService;
    private final SteamService steamService;

    public GameController(
            GameService gameService,
            SteamService steamService
    ) {
        this.gameService = gameService;
        this.steamService = steamService;
    }

    @GetMapping
    public List<GameDto> getAllGames() {
        return gameService.getAllGames()
                .stream()
                .map(
                        game -> GameDto.from(
                                game,
                                gameService.getGameOverallTier(
                                        game.getId()
                                )
                        )
                )
                .toList();
    }

    /*
     * Individual game pages use the Steam App ID.
     *
     * Example:
     * /games/570 -> Dota 2
     * /games/1174180 -> Red Dead Redemption 2
     */
    @GetMapping("/{steamAppid}")
    public GameDto getGameBySteamAppid(
            @PathVariable Integer steamAppid
    ) {
        Game game =
                gameService.getGameBySteamAppid(
                        steamAppid
                );

        String overallTier =
                gameService.getGameOverallTier(
                        game.getId()
                );

        return GameDto.from(
                game,
                overallTier
        );
    }

    /*
     * Related-games lookup still uses the internal database ID.
     *
     * The frontend already calls this with game.id.
     */
    @GetMapping("/{id}/related")
    public List<GameDto> getRelatedGames(
            @PathVariable Long id
    ) {
        return gameService.getRelatedGames(id)
                .stream()
                .map(
                        game -> GameDto.from(
                                game,
                                gameService.getGameOverallTier(
                                        game.getId()
                                )
                        )
                )
                .toList();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GameDto createGame(
            @RequestParam Integer steamAppid,
            @RequestParam String name
    ) {
        Game game =
                gameService.createGame(
                        steamAppid,
                        name
                );

        return GameDto.from(
                game,
                "Pending"
        );
    }

    @GetMapping("/search")
    public List<GameDto> searchGames(
            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String query
    ) {
        List<GameDto> dtos =
                new ArrayList<>();

        for (
                Game game :
                gameService.searchGames(query)
        ) {
            String overallTier =
                    gameService.getGameOverallTier(
                            game.getId()
                    );

            dtos.add(
                    GameDto.from(
                            game,
                            overallTier
                    )
            );
        }

        return dtos;
    }

    @GetMapping("/{steamAppid}/players")
    public Map<String, Object> getPlayerCount(
            @PathVariable Integer steamAppid
    ) {
        Integer count =
                steamService.getCurrentPlayers(
                        steamAppid
                );

        return Map.of(
                "playerCount",
                count == null ? -1 : count
        );
    }
}