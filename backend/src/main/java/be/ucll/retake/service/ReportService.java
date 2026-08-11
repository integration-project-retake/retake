package be.ucll.retake.service;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public ReportService(
            ReportRepository reportRepository,
            UserRepository userRepository,
            GameRepository gameRepository
    ) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Report with id " + id + " not found"
                        )
                );
    }

    public List<Report> getReportsByGameId(
            Long gameId
    ) {
        if (!gameRepository.existsById(gameId)) {
            throw new IllegalArgumentException(
                    "Game with id " + gameId + " not found"
            );
        }

        return reportRepository.findByGameId(gameId);
    }

    public Report createReport(
            Long userId,
            Long gameId,
            Tier tier,
            String distribution,
            String comment,
            String protonVersion
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "User with id " + userId + " not found"
                        )
                );

        Game game = gameRepository.findById(gameId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Game with id " + gameId + " not found"
                        )
                );

        validateReportData(
                tier,
                distribution,
                comment,
                protonVersion
        );

        Report report = new Report(
                user,
                game,
                tier,
                distribution.trim(),
                comment.trim(),
                protonVersion.trim()
        );

        return reportRepository.save(report);
    }

    public List<Report> getReportsByUserId(
            Long userId
    ) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException(
                    "User with id " + userId + " not found"
            );
        }

        return reportRepository.findByUserId(userId);
    }

    public Report updateReport(
            Long reportId,
            Long userId,
            Tier tier,
            String distribution,
            String comment,
            String protonVersion
    ) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Report with id " + reportId + " not found"
                        )
                );

        if (!report.getUser().getId().equals(userId)) {
            throw new SecurityException(
                    "You cannot edit a report created by another user"
            );
        }

        validateReportData(
                tier,
                distribution,
                comment,
                protonVersion
        );

        report.setTier(tier);
        report.setDistro(distribution.trim());
        report.setComment(comment.trim());
        report.setProtonVersion(protonVersion.trim());

        return reportRepository.save(report);
    }

    public void deleteReport(
            Long reportId,
            Long userId
    ) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Report with id " + reportId + " not found"
                        )
                );

        if (!report.getUser().getId().equals(userId)) {
            throw new SecurityException(
                    "You cannot delete a report created by another user"
            );
        }

        reportRepository.delete(report);
    }

    private void validateReportData(
            Tier tier,
            String distribution,
            String comment,
            String protonVersion
    ) {
        if (tier == null) {
            throw new IllegalArgumentException(
                    "Compatibility tier is required"
            );
        }

        if (
                distribution == null ||
                        distribution.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Distribution is required"
            );
        }

        if (
                protonVersion == null ||
                        protonVersion.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Proton version is required"
            );
        }

        if (
                comment == null ||
                        comment.isBlank()
        ) {
            throw new IllegalArgumentException(
                    "Comment is required"
            );
        }
    }


        public List<Report> getReportsBySteamAppid(Integer steamAppid) {
        if (!gameRepository.existsBySteamAppid(steamAppid)) {
                throw new IllegalArgumentException("Game with steam appid " + steamAppid + " not found");
        }
        return reportRepository.findByGameSteamAppid(steamAppid);
        }
}