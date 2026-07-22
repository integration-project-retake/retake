package be.ucll.retake.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.retake.dto.GameDto;
import be.ucll.retake.service.GameService;

@RestController
@RequestMapping("/games")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }
    @GetMapping
    public List<GameDto> getAllGames() {
        return gameService.getAllGames().stream()
                .map(GameDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public GameDto getGameById(@PathVariable Long id) {
        return GameDto.from(gameService.getGameById(id));
    }

}
