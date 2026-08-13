package be.ucll.retake.dto;

import java.util.List;

public record DashboardStatsDto(
        long totalGames,
        long totalReports,
        long totalUsers,
        double averageReportsPerGame,
        List<TierStat> tierDistribution,
        List<GenreStat> genreDistribution,
        List<GenreCompatibilityStat> compatibilityByGenre,
        List<GameReportStat> mostReportedGames,
        List<ContributorStat> topContributors
) {

    public record TierStat(
            String tier,
            long count
    ) {
    }

    public record GenreStat(
            String genre,
            long count
    ) {
    }

    public record GenreCompatibilityStat(
            String genre,
            long platinum,
            long gold,
            long silver,
            long bronze,
            long borked,
            long pending
    ) {
    }

    public record GameReportStat(
            Long gameId,
            Integer steamAppid,
            String gameName,
            long reportCount
    ) {
    }

    public record ContributorStat(
            Long userId,
            String username,
            String avatarUrl,
            long reportCount
    ) {
    }
}