package be.ucll.retake.service;

import java.util.List;

import org.springframework.stereotype.Service;

import be.ucll.retake.model.Game;
import be.ucll.retake.repository.GameRepository;

@Service
public class GameService {
    private final GameRepository gameRepository;

    public GameService(GameRepository gameRepository) {
        this.gameRepository = gameRepository;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Game with id " + id + " not found"));
    }

    public Game createGame(Integer steamAppid, String name) {
        if (gameRepository.existsBySteamAppid(steamAppid)) {
            throw new IllegalArgumentException("Game with steam appid" + steamAppid + " not found");
        }
        return gameRepository.save(new Game(steamAppid, name));
    }
}
