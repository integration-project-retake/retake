package be.ucll.retake.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import be.ucll.retake.dto.DashboardStatsDto;
import be.ucll.retake.service.DashboardService;

@RestController
@RequestMapping("/dashboard")
@CrossOrigin(
        origins = {
                "http://localhost:3000",
                "http://127.0.0.1:3000"
        }
)
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(
            DashboardService dashboardService
    ) {
        this.dashboardService =
                dashboardService;
    }

    @GetMapping
    public DashboardStatsDto getDashboard() {
        return dashboardService
                .getDashboardStats();
    }
}