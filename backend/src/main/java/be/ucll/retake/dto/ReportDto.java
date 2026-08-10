package be.ucll.retake.dto;

import java.time.Instant;

import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;

public record ReportDto(Long id, Long user_id, String username, Long game_id, String gameName,
                        Integer steamAppid, Tier tier, String distribution, String comment,
                        String protonVersion, Instant createdAt) {
    public static ReportDto from(Report report) {
        return new ReportDto(
            report.getId(),
            report.getUser().getId(),
            report.getUser().getUsername(),
            report.getGame().getId(),
            report.getGame().getName(),
            report.getGame().getSteamAppid(),
            report.getTier(),
            report.getDistro(),
            report.getComment(),
            report.getProtonVersion(),
            report.getCreatedAt()
        );
    }
}
