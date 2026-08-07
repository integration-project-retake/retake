package be.ucll.retake.service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private final ReportRepository reportRepository;

    public GameService(GameRepository gameRepository, ReportRepository reportRepository) {
            this.gameRepository = gameRepository;
            this.reportRepository = reportRepository;
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
    public List<Game> searchGames(String query) {
        if (query == null || query.isBlank()) {
            return gameRepository.findAll();
        }
        String strimmed = query.trim();
        // if query is all digit, treats it as steamid
        if (strimmed.matches("\\d+")) {
            Integer addid = Integer.parseInt(strimmed);
            return gameRepository.findBySteamAppid(addid).map(List::of).orElse(List.of());
        }
        return gameRepository.findByNameContainingIgnoreCase(strimmed);
    }
    public String getGameOverallTier(Long gameId) {
            List<Report> reports = reportRepository.findByGameId(gameId);
            if (reports.isEmpty()) return "Pending";

            return reports.stream()
                    .collect(Collectors.groupingBy(Report::getTier, Collectors.counting()))
                    .entrySet().stream()
                    .max(Map.Entry.comparingByValue())
                    .map(entry -> entry.getKey().name())
                    .orElse("Pending");
        }
}
