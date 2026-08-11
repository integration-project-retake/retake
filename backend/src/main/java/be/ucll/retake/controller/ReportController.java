package be.ucll.retake.controller;

import java.util.ArrayList;
import java.util.List;

import be.ucll.retake.dto.ReportDto;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.service.ReportService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReportDto> getAllReports() {
        return reportService
                .getAllReports()
                .stream()
                .map(ReportDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ReportDto getReportById(
            @PathVariable Long id
    ) {
        return ReportDto.from(
                reportService.getReportById(id)
        );
    }

    @GetMapping("/steam/{steamAppid}")
    public List<ReportDto> getReportsBySteamAppid(
            @PathVariable Integer steamAppid
    ) {
        return reportService
                .getReportsBySteamAppid(steamAppid)
                .stream()
                .map(ReportDto::from)
                .toList();
    }

    @GetMapping("/game/{gameId}")
    public List<ReportDto> getReportsByGameId(
            @PathVariable Long gameId
    ) {
        return reportService
                .getReportsByGameId(gameId)
                .stream()
                .map(ReportDto::from)
                .toList();
    }

    @GetMapping("/user/{userId}")
    public List<ReportDto> getReportsByUserId(
            @PathVariable Long userId
    ) {
        List<ReportDto> dtos =
                new ArrayList<>();

        for (
                Report report :
                reportService.getReportsByUserId(userId)
        ) {
            dtos.add(
                    ReportDto.from(report)
            );
        }

        return dtos;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportDto createReport(
            @RequestParam Long userId,
            @RequestParam Long gameId,
            @RequestParam Tier tier,
            @RequestParam String distribution,
            @RequestParam String comment,
            @RequestParam String protonVersion
    ) {
        try {
            return ReportDto.from(
                    reportService.createReport(
                            userId,
                            gameId,
                            tier,
                            distribution,
                            comment,
                            protonVersion
                    )
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    @PutMapping("/{id}")
    public ReportDto updateReport(
            @PathVariable Long id,
            @RequestParam Tier tier,
            @RequestParam String distribution,
            @RequestParam String comment,
            @RequestParam String protonVersion,
            HttpServletRequest request
    ) {
        User user =
                getAuthenticatedUser(
                        request,
                        "You must be logged in to edit a report"
                );

        try {
            return ReportDto.from(
                    reportService.updateReport(
                            id,
                            user.getId(),
                            tier,
                            distribution,
                            comment,
                            protonVersion
                    )
            );
        } catch (SecurityException e) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    e.getMessage()
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    e.getMessage()
            );
        }
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReport(
            @PathVariable Long id,
            HttpServletRequest request
    ) {
        User user =
                getAuthenticatedUser(
                        request,
                        "You must be logged in to delete a report"
                );

        try {
            reportService.deleteReport(
                    id,
                    user.getId()
            );
        } catch (SecurityException e) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    e.getMessage()
            );
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    e.getMessage()
            );
        }
    }

    private User getAuthenticatedUser(
            HttpServletRequest request,
            String errorMessage
    ) {
        HttpSession session =
                request.getSession(false);

        if (session == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    errorMessage
            );
        }

        User user =
                (User) session.getAttribute(
                        "user"
                );

        if (user == null) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    errorMessage
            );
        }

        return user;
    }
}