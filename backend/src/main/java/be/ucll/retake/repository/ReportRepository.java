package be.ucll.retake.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.User;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByGame(Game game);
    List<Report> findByGameSteamAppid(Integer steamAppid);
    List<Report> findByGameId(Long gameId);
    List<Report> findByUser(User user);
}
