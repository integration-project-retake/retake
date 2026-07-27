package be.ucll.retake.service;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;

    public ReportService(ReportRepository reportRepository,
                         UserRepository userRepository,
                         GameRepository gameRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
        this.gameRepository = gameRepository;
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public Report getReportById(Long id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Report with id " + id + " not found"));
    }
    public List<Report> getReportsBySteamAppid(Integer steamAppid) {
        if (!gameRepository.existsBySteamAppid(steamAppid)) {
            throw new IllegalArgumentException("Game with steam appid " + steamAppid + " not found");
        }
        return reportRepository.findByGameSteamAppid(steamAppid);
    }
    public List<Report> getReportsByGameId(Long gameId) {
        if (!gameRepository.existsById(gameId)) {
            throw new IllegalArgumentException("Game with id " + gameId + " not found");
        }
        return reportRepository.findByGameId(gameId);
    }

    public Report createReport(Long userId, Long gameId, Tier tier, String distribution, String comment, String protonVersion) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with id " + userId + " not found"));
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new IllegalArgumentException("Game with id " + gameId + " not found"));

        return reportRepository.save(new Report(user, game, tier, distribution, comment, protonVersion));
    }
}