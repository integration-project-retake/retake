package be.ucll.retake.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.stereotype.Service;

import be.ucll.retake.dto.DashboardStatsDto;
import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;

@Service
public class DashboardService {

    private final GameRepository gameRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final GameService gameService;

    public DashboardService(
            GameRepository gameRepository,
            ReportRepository reportRepository,
            UserRepository userRepository,
            GameService gameService
    ) {
        this.gameRepository = gameRepository;
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.gameService = gameService;
    }

    public DashboardStatsDto getDashboardStats() {

        List<Game> games =
                gameRepository.findAll();

        List<Report> reports =
                reportRepository.findAll();

        long totalGames =
                games.size();

        long totalReports =
                reports.size();

        long totalUsers =
                userRepository.count();

        double averageReportsPerGame =
                totalGames == 0
                        ? 0.0
                        : (double) totalReports / totalGames;

        /*
         * Calculate every game's overall tier once.
         *
         * This is then reused for:
         * - tier distribution
         * - compatibility by genre
         */
        Map<Long, String> gameTiers =
                new LinkedHashMap<>();

        for (Game game : games) {

            String tier =
                    gameService.getGameOverallTier(
                            game.getId()
                    );

            if (tier == null) {
                tier = "Pending";
            }

            gameTiers.put(
                    game.getId(),
                    tier
            );
        }

        List<DashboardStatsDto.TierStat>
                tierDistribution =
                calculateTierDistribution(
                        games,
                        gameTiers
                );

        List<DashboardStatsDto.GenreStat>
                genreDistribution =
                calculateGenreDistribution(
                        games
                );

        List<DashboardStatsDto.GenreCompatibilityStat>
                compatibilityByGenre =
                calculateCompatibilityByGenre(
                        games,
                        gameTiers
                );

        List<DashboardStatsDto.GameReportStat>
                mostReportedGames =
                calculateMostReportedGames(
                        reports
                );

        List<DashboardStatsDto.ContributorStat>
                topContributors =
                calculateTopContributors(
                        reports
                );

        return new DashboardStatsDto(
                totalGames,
                totalReports,
                totalUsers,
                averageReportsPerGame,
                tierDistribution,
                genreDistribution,
                compatibilityByGenre,
                mostReportedGames,
                topContributors
        );
    }

    private List<DashboardStatsDto.TierStat>
    calculateTierDistribution(
            List<Game> games,
            Map<Long, String> gameTiers
    ) {

        Map<String, Long> counts =
                new LinkedHashMap<>();

        counts.put("Platinum", 0L);
        counts.put("Gold", 0L);
        counts.put("Silver", 0L);
        counts.put("Bronze", 0L);
        counts.put("Borked", 0L);
        counts.put("Pending", 0L);

        for (Game game : games) {

            String tier =
                    gameTiers.getOrDefault(
                            game.getId(),
                            "Pending"
                    );

            counts.put(
                    tier,
                    counts.getOrDefault(
                            tier,
                            0L
                    ) + 1
            );
        }

        return counts.entrySet()
                .stream()
                .map(
                        entry ->
                                new DashboardStatsDto.TierStat(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                )
                .toList();
    }

    private List<DashboardStatsDto.GenreStat>
    calculateGenreDistribution(
            List<Game> games
    ) {

        Map<String, Long> counts =
                new TreeMap<>();

        for (Game game : games) {

            for (String genre : game.getGenres()) {

                counts.put(
                        genre,
                        counts.getOrDefault(
                                genre,
                                0L
                        ) + 1
                );
            }
        }

        return counts.entrySet()
                .stream()
                .sorted(
                        Map.Entry
                                .<String, Long>comparingByValue()
                                .reversed()
                                .thenComparing(
                                        Map.Entry.comparingByKey()
                                )
                )
                .map(
                        entry ->
                                new DashboardStatsDto.GenreStat(
                                        entry.getKey(),
                                        entry.getValue()
                                )
                )
                .toList();
    }

    private List<DashboardStatsDto.GenreCompatibilityStat>
    calculateCompatibilityByGenre(
            List<Game> games,
            Map<Long, String> gameTiers
    ) {

        Map<String, Map<String, Long>>
                stats =
                new TreeMap<>();

        for (Game game : games) {

            String tier =
                    gameTiers.getOrDefault(
                            game.getId(),
                            "Pending"
                    );

            for (String genre : game.getGenres()) {

                Map<String, Long> tierCounts =
                        stats.computeIfAbsent(
                                genre,
                                ignored ->
                                        createEmptyTierMap()
                        );

                tierCounts.put(
                        tier,
                        tierCounts.getOrDefault(
                                tier,
                                0L
                        ) + 1
                );
            }
        }

        List<DashboardStatsDto.GenreCompatibilityStat>
                result =
                new ArrayList<>();

        for (
                Map.Entry<
                        String,
                        Map<String, Long>
                        > entry :
                stats.entrySet()
        ) {

            Map<String, Long> tiers =
                    entry.getValue();

            result.add(
                    new DashboardStatsDto.GenreCompatibilityStat(
                            entry.getKey(),
                            tiers.getOrDefault(
                                    "Platinum",
                                    0L
                            ),
                            tiers.getOrDefault(
                                    "Gold",
                                    0L
                            ),
                            tiers.getOrDefault(
                                    "Silver",
                                    0L
                            ),
                            tiers.getOrDefault(
                                    "Bronze",
                                    0L
                            ),
                            tiers.getOrDefault(
                                    "Borked",
                                    0L
                            ),
                            tiers.getOrDefault(
                                    "Pending",
                                    0L
                            )
                    )
            );
        }

        result.sort(
                Comparator.comparingLong(
                        this::totalForGenre
                ).reversed()
        );

        return result;
    }

    private Map<String, Long>
    createEmptyTierMap() {

        Map<String, Long> map =
                new LinkedHashMap<>();

        map.put("Platinum", 0L);
        map.put("Gold", 0L);
        map.put("Silver", 0L);
        map.put("Bronze", 0L);
        map.put("Borked", 0L);
        map.put("Pending", 0L);

        return map;
    }

    private long totalForGenre(
            DashboardStatsDto.GenreCompatibilityStat stat
    ) {

        return stat.platinum()
                + stat.gold()
                + stat.silver()
                + stat.bronze()
                + stat.borked()
                + stat.pending();
    }

    private List<DashboardStatsDto.GameReportStat>
    calculateMostReportedGames(
            List<Report> reports
    ) {

        Map<Long, List<Report>>
                reportsByGame =
                new LinkedHashMap<>();

        for (Report report : reports) {

            Long gameId =
                    report.getGame()
                            .getId();

            reportsByGame
                    .computeIfAbsent(
                            gameId,
                            ignored ->
                                    new ArrayList<>()
                    )
                    .add(report);
        }

        return reportsByGame.values()
                .stream()
                .map(gameReports -> {

                    Report first =
                            gameReports.get(0);

                    Game game =
                            first.getGame();

                    return new DashboardStatsDto.GameReportStat(
                            game.getId(),
                            game.getSteamAppid(),
                            game.getName(),
                            gameReports.size()
                    );
                })
                .sorted(
                        Comparator.comparingLong(
                                DashboardStatsDto.GameReportStat
                                        ::reportCount
                        ).reversed()
                )
                .limit(5)
                .toList();
    }

    private List<DashboardStatsDto.ContributorStat>
    calculateTopContributors(
            List<Report> reports
    ) {

        Map<Long, List<Report>>
                reportsByUser =
                new LinkedHashMap<>();

        for (Report report : reports) {

            Long userId =
                    report.getUser()
                            .getId();

            reportsByUser
                    .computeIfAbsent(
                            userId,
                            ignored ->
                                    new ArrayList<>()
                    )
                    .add(report);
        }

        return reportsByUser.values()
                .stream()
                .map(userReports -> {

                    User user =
                            userReports
                                    .get(0)
                                    .getUser();

                    return new DashboardStatsDto.ContributorStat(
                            user.getId(),
                            user.getUsername(),
                            user.getAvatarUrl(),
                            userReports.size()
                    );
                })
                .sorted(
                        Comparator.comparingLong(
                                DashboardStatsDto.ContributorStat
                                        ::reportCount
                        ).reversed()
                )
                .limit(5)
                .toList();
    }
}