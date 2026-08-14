package be.ucll.retake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;
import be.ucll.retake.exception.ResourceNotFoundException;

@ExtendWith(MockitoExtension.class)
public class ReportServiceTest {

    @Mock
    private ReportRepository reportRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private GameRepository gameRepository;

    private ReportService reportService;

    @BeforeEach
    void setup() {
        reportService = new ReportService(
                reportRepository,
                userRepository,
                gameRepository
        );
    }

    @Test
    void givenReports_whenGettingAllReports_thenReturnAllReports() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report report1 = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        Report report2 = new Report(
                user,
                game,
                Tier.Platinum,
                "SteamOS",
                "Runs perfectly.",
                "Proton Experimental"
        );

        when(reportRepository.findAll())
                .thenReturn(List.of(report1, report2));

        List<Report> result =
                reportService.getAllReports();

        assertEquals(2, result.size());
        assertSame(report1, result.get(0));
        assertSame(report2, result.get(1));
    }

    @Test
    void givenExistingReportId_whenGettingReportById_thenReturnReport() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report report = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        when(reportRepository.findById(1L))
                .thenReturn(Optional.of(report));

        Report result =
                reportService.getReportById(1L);

        assertSame(report, result);
    }

        @Test
        void givenUnknownReportId_whenGettingReportById_thenThrowError() {
        when(reportRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.getReportById(99L)
                );

        assertEquals(
                "Report with id 99 not found",
                exception.getMessage()
        );
        }

    @Test
    void givenExistingSteamAppid_whenGettingReportsBySteamAppid_thenReturnReports() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report report = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        when(gameRepository.existsBySteamAppid(570))
                .thenReturn(true);

        when(reportRepository.findByGameSteamAppid(570))
                .thenReturn(List.of(report));

        List<Report> result =
                reportService.getReportsBySteamAppid(570);

        assertEquals(1, result.size());
        assertSame(report, result.get(0));
    }

    @Test
    void givenUnknownSteamAppid_whenGettingReportsBySteamAppid_thenThrowError() {
        when(gameRepository.existsBySteamAppid(999))
                .thenReturn(false);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.getReportsBySteamAppid(999)
                );

        assertEquals(
                "Game with steam appid 999 not found",
                exception.getMessage()
        );
    }

    @Test
    void givenExistingGameId_whenGettingReportsByGameId_thenReturnReports() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report report = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        when(gameRepository.existsById(1L))
                .thenReturn(true);

        when(reportRepository.findByGameId(1L))
                .thenReturn(List.of(report));

        List<Report> result =
                reportService.getReportsByGameId(1L);

        assertEquals(1, result.size());
        assertSame(report, result.get(0));
    }

    @Test
    void givenUnknownGameId_whenGettingReportsByGameId_thenThrowError() {
        when(gameRepository.existsById(99L))
                .thenReturn(false);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.getReportsByGameId(99L)
                );

        assertEquals(
                "Game with id 99 not found",
                exception.getMessage()
        );
    }

    @Test
    void givenValidData_whenCreatingReport_thenSaveAndReturnReport() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report savedReport = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(gameRepository.findById(2L))
                .thenReturn(Optional.of(game));

        when(reportRepository.save(any(Report.class)))
                .thenReturn(savedReport);

        Report result =
                reportService.createReport(
                        1L,
                        2L,
                        Tier.Gold,
                        "Ubuntu",
                        "Runs well.",
                        "Proton 9.0-3"
                );

        assertSame(savedReport, result);

        verify(reportRepository)
                .save(any(Report.class));
    }

    @Test
    void givenUnknownUser_whenCreatingReport_thenThrowError() {
        when(userRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.createReport(
                                99L,
                                1L,
                                Tier.Gold,
                                "Ubuntu",
                                "Runs well.",
                                "Proton 9.0-3"
                        )
                );

        assertEquals(
                "User with id 99 not found",
                exception.getMessage()
        );
    }

    @Test
    void givenUnknownGame_whenCreatingReport_thenThrowError() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(gameRepository.findById(99L))
                .thenReturn(Optional.empty());

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.createReport(
                                1L,
                                99L,
                                Tier.Gold,
                                "Ubuntu",
                                "Runs well.",
                                "Proton 9.0-3"
                        )
                );

        assertEquals(
                "Game with id 99 not found",
                exception.getMessage()
        );
    }

    @Test
    void givenExistingUserId_whenGettingReportsByUserId_thenReturnReports() {
        User user = new User(
                "annie",
                "annie@ucll.be",
                "password"
        );

        Game game = new Game(
                570,
                "Dota 2"
        );

        Report report = new Report(
                user,
                game,
                Tier.Gold,
                "Ubuntu",
                "Runs well.",
                "Proton 9.0-3"
        );

        when(userRepository.existsById(1L))
                .thenReturn(true);

        when(reportRepository.findByUserId(1L))
                .thenReturn(List.of(report));

        List<Report> result =
                reportService.getReportsByUserId(1L);

        assertEquals(1, result.size());
        assertSame(report, result.get(0));
    }

    @Test
    void givenUnknownUserId_whenGettingReportsByUserId_thenThrowError() {
        when(userRepository.existsById(99L))
                .thenReturn(false);

        ResourceNotFoundException exception =
                assertThrows(
                        ResourceNotFoundException.class,
                        () -> reportService.getReportsByUserId(99L)
                );

        assertEquals(
                "User with id 99 not found",
                exception.getMessage()
        );
    }
}