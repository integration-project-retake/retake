package be.ucll.retake.controller;

import java.util.ArrayList;
import java.util.List;

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

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping
    public List<GameDto> getAllGames() {
        return gameService.getAllGames()
                .stream()
                .map(
                        game -> GameDto.from(
                                game,
                                gameService.getGameOverallTier(game.getId())
                        )
                )
                .toList();
    }

    @GetMapping("/{id}")
    public GameDto getGameById(
            @PathVariable Long id
    ) {
        Game game = gameService.getGameById(id);

        String overallTier =
                gameService.getGameOverallTier(id);

        return GameDto.from(game, overallTier);
    }

    @GetMapping("/{id}/related")
    public List<GameDto> getRelatedGames(
            @PathVariable Long id
    ) {
        return gameService.getRelatedGames(id)
                .stream()
                .map(
                        game -> GameDto.from(
                                game,
                                gameService.getGameOverallTier(game.getId())
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
}