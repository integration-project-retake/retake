package be.ucll.retake.service;

import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
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
                    "Game with steam appid "
                            + steamAppid
                            + " already exists"
            );
        }

        return gameRepository.save(
                new Game(steamAppid, name)
        );
    }

    public List<Game> searchGames(String query) {
        if (query == null || query.isBlank()) {
            return gameRepository.findAll();
        }

        String trimmed = query.trim();

        // Partial Steam App ID Search
        if (trimmed.matches("\\d+")) {
            return gameRepository
                    .findBySteamAppidStartingWith(trimmed);
        }

        String normalizedQuery =
                normalize(trimmed);

        return gameRepository.findAll()
                .stream()
                .filter(
                        game ->
                                matchesSearch(
                                        game,
                                        normalizedQuery
                                )
                )
                .sorted(
                        Comparator.comparingDouble(
                                (Game game) ->
                                        searchScore(
                                                game,
                                                normalizedQuery
                                        )
                        ).reversed()
                )
                .toList();
    }

    private boolean matchesSearch(
            Game game,
            String query
    ) {
        // Real game name
        if (
                matchesCandidate(
                        normalize(game.getName()),
                        query
                )
        ) {
            return true;
        }

        // Aliases
        return game.getAliases()
                .stream()
                .map(this::normalize)
                .anyMatch(
                        alias ->
                                matchesCandidate(
                                        alias,
                                        query
                                )
                );
    }

    private boolean matchesCandidate(
            String candidate,
            String query
    ) {
        if (
                candidate.isEmpty()
                        || query.isEmpty()
        ) {
            return false;
        }

        // Exact / partial match
        if (candidate.contains(query)) {
            return true;
        }

        // Handles added spaces or punctuation after normalization
        if (query.contains(candidate)) {
            return true;
        }

        /*
         * Avoid aggressive fuzzy matching for
         * extremely short queries.
         */
        if (query.length() < 4) {
            return false;
        }

        double similarity =
                bestFuzzySimilarity(
                        candidate,
                        query
                );

        return similarity >= 0.65;
    }

    private double searchScore(
            Game game,
            String query
    ) {
        double bestScore =
                bestFuzzySimilarity(
                        normalize(game.getName()),
                        query
                );

        for (String alias : game.getAliases()) {

            double aliasScore =
                    bestFuzzySimilarity(
                            normalize(alias),
                            query
                    );

            bestScore =
                    Math.max(
                            bestScore,
                            aliasScore
                    );
        }

        return bestScore;
    }

    private double bestFuzzySimilarity(
            String candidate,
            String query
    ) {
        if (
                candidate.isEmpty()
                        || query.isEmpty()
        ) {
            return 0.0;
        }

        // Exact match
        if (candidate.equals(query)) {
            return 1.0;
        }

        // Exact substring
        if (candidate.contains(query)) {
            return 0.99;
        }

        if (query.contains(candidate)) {
            return 0.98;
        }

        int queryLength =
                query.length();

        /*
         * Compare against differently-sized windows
         * inside the full title.
         *
         * Example:
         *
         * query:     grendthef
         * title:     grandtheftautov
         *
         * It can compare against "grandtheft"
         * rather than penalising the query for the
         * remaining "autov".
         */
        int minimumWindow =
                Math.max(
                        1,
                        queryLength - 3
                );

        //
        int maximumWindow =
                Math.min(
                        candidate.length(),
                        queryLength + 3
                );

        double bestSimilarity = 0.0;

        for (
                int windowLength = minimumWindow;
                windowLength <= maximumWindow;
                windowLength++
        ) {
            for (
                    int start = 0;
                    start + windowLength <= candidate.length();
                    start++
            ) {
                String window =
                        candidate.substring(
                                start,
                                start + windowLength
                        );

                double similarity =
                        similarity(
                                window,
                                query
                        );

                bestSimilarity =
                        Math.max(
                                bestSimilarity,
                                similarity
                        );
            }
        }

        // Complete-string comparison as well
        bestSimilarity =
                Math.max(
                        bestSimilarity,
                        similarity(
                                candidate,
                                query
                        )
                );

        return bestSimilarity;
    }

    private double similarity(
            String first,
            String second
    ) {
        int distance =
                damerauLevenshteinDistance(
                        first,
                        second
                );

        int maxLength =
                Math.max(
                        first.length(),
                        second.length()
                );

        if (maxLength == 0) {
            return 1.0;
        }

        return 1.0
                - ((double) distance / maxLength);
    }

    /*
     * Damerau-Levenshtein supports:
     *
     * - wrong letters
     * - missing letters
     * - extra letters
     * - neighbouring letters being swapped
     */
    private int damerauLevenshteinDistance(
            String first,
            String second
    ) {
        int[][] dp =
                new int[
                        first.length() + 1
                        ][
                        second.length() + 1
                        ];

        for (
                int i = 0;
                i <= first.length();
                i++
        ) {
            dp[i][0] = i;
        }

        for (
                int j = 0;
                j <= second.length();
                j++
        ) {
            dp[0][j] = j;
        }

        for (
                int i = 1;
                i <= first.length();
                i++
        ) {
            for (
                    int j = 1;
                    j <= second.length();
                    j++
            ) {
                int cost =
                        first.charAt(i - 1)
                                ==
                                second.charAt(j - 1)
                                ? 0
                                : 1;

                int deletion =
                        dp[i - 1][j] + 1;

                int insertion =
                        dp[i][j - 1] + 1;

                int substitution =
                        dp[i - 1][j - 1]
                                + cost;

                dp[i][j] =
                        Math.min(
                                Math.min(
                                        deletion,
                                        insertion
                                ),
                                substitution
                        );

                /*
                 * Transposition:
                 *
                 * "gaem" -> "game"
                 */
                if (
                        i > 1
                                && j > 1
                                && first.charAt(i - 1)
                                ==
                                second.charAt(j - 2)
                                && first.charAt(i - 2)
                                ==
                                second.charAt(j - 1)
                ) {
                    dp[i][j] =
                            Math.min(
                                    dp[i][j],
                                    dp[i - 2][j - 2] + 1
                            );
                }
            }
        }

        return dp[
                first.length()
                ][
                second.length()
                ];
    }

    /*
     * Makes spacing, punctuation and casing irrelevant.
     *
     * "Do TA 2"       -> "dota2"
     * "Baldur's Gate" -> "baldursgate"
     */
    private String normalize(
            String value
    ) {
        return value
                .toLowerCase(Locale.ROOT)
                .replaceAll(
                        "[^a-z0-9]",
                        ""
                );
    }

    public List<Game> getRelatedGames(
            Long gameId
    ) {
        Game selectedGame =
                getGameById(gameId);

        Set<String> selectedGenres =
                selectedGame.getGenres();

        if (
                selectedGenres == null
                        || selectedGenres.isEmpty()
        ) {
            return List.of();
        }

        return gameRepository.findAll()
                .stream()
                .filter(
                        game ->
                                !game
                                        .getId()
                                        .equals(gameId)
                )
                .filter(
                        game ->
                                hasSharedGenre(
                                        game,
                                        selectedGenres
                                )
                )
                .sorted(
                        Comparator
                                .comparingInt(
                                        (Game game) ->
                                                countSharedGenres(
                                                        game,
                                                        selectedGenres
                                                )
                                )
                                .reversed()
                                .thenComparing(
                                        Game::getName
                                )
                )
                .limit(6)
                .toList();
    }

    private boolean hasSharedGenre(
            Game game,
            Set<String> selectedGenres
    ) {
        return countSharedGenres(
                game,
                selectedGenres
        ) > 0;
    }

    private int countSharedGenres(
            Game game,
            Set<String> selectedGenres
    ) {
        return (int) game
                .getGenres()
                .stream()
                .filter(
                        selectedGenres::contains
                )
                .count();
    }

    public String getGameOverallTier(
            Long gameId
    ) {
        List<Report> reports =
                reportRepository
                        .findByGameId(gameId);

        if (reports.isEmpty()) {
            return "Pending";
        }

        return reports
                .stream()
                .collect(
                        Collectors.groupingBy(
                                Report::getTier,
                                Collectors.counting()
                        )
                )
                .entrySet()
                .stream()
                .max(
                        Map.Entry.comparingByValue()
                )
                .map(
                        entry ->
                                entry
                                        .getKey()
                                        .name()
                )
                .orElse("Pending");
    }
}