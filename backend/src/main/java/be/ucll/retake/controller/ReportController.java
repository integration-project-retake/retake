package be.ucll.retake.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.retake.dto.ReportDto;
import be.ucll.retake.model.Tier;
import be.ucll.retake.service.ReportService;

@RestController
@RequestMapping("/reports")
public class ReportController {
    private final ReportService reportService;
    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }
    @GetMapping
    public List<ReportDto> getAllReports() {
        return reportService.getAllReports().stream()
                .map(ReportDto::from)
                .toList();
    }

    @GetMapping("/{id}")
    public ReportDto getReportById(@PathVariable Long id) {
        return ReportDto.from(reportService.getReportById(id));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReportDto createReport(@RequestParam Long userId,
                                  @RequestParam Long gameId,
                                  @RequestParam Tier tier,
                                  @RequestParam String distribution) {
        return ReportDto.from(reportService.createReport(userId, gameId, tier, distribution));
    }
}