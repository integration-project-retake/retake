package be.ucll.retake.service;

import java.util.List;
import java.util.Locale;
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

    public GameService(
            GameRepository gameRepository,
            ReportRepository reportRepository
    ) {
        this.gameRepository = gameRepository;
        this.reportRepository = reportRepository;
    }

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Game with id " + id + " not found"
                        )
                );
    }

    public Game createGame(Integer steamAppid, String name) {
        if (gameRepository.existsBySteamAppid(steamAppid)) {
            throw new IllegalArgumentException(
                    "Game with steam appid " + steamAppid + " already exists"
            );
        }

        return gameRepository.save(new Game(steamAppid, name));
    }

    public List<Game> searchGames(String query) {
        if (query == null || query.isBlank()) {
            return gameRepository.findAll();
        }

        String trimmed = query.trim();

        // Numeric searches are treated as exact Steam App IDs.
        if (trimmed.matches("\\d+")) {
            Integer steamAppid = Integer.parseInt(trimmed);

            return gameRepository
                    .findBySteamAppid(steamAppid)
                    .map(List::of)
                    .orElse(List.of());
        }

        String normalizedQuery = trimmed.toLowerCase(Locale.ROOT);

        return gameRepository.findAll()
                .stream()
                .filter(game -> matchesSearch(game, normalizedQuery))
                .toList();
    }

    private boolean matchesSearch(
            Game game,
            String normalizedQuery
    ) {
        boolean nameMatches = game
                .getName()
                .toLowerCase(Locale.ROOT)
                .contains(normalizedQuery);

        boolean aliasMatches = game
                .getAliases()
                .stream()
                .anyMatch(
                        alias -> alias
                                .toLowerCase(Locale.ROOT)
                                .contains(normalizedQuery)
                );

        return nameMatches || aliasMatches;
    }

    public String getGameOverallTier(Long gameId) {
        List<Report> reports = reportRepository.findByGameId(gameId);

        if (reports.isEmpty()) {
            return "Pending";
        }

        return reports.stream()
                .collect(
                        Collectors.groupingBy(
                                Report::getTier,
                                Collectors.counting()
                        )
                )
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(entry -> entry.getKey().name())
                .orElse("Pending");
    }
}