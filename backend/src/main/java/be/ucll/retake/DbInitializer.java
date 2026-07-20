package be.ucll.retake;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DbInitializer implements CommandLineRunner {

    private final GameRepository gameRepository;
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public DbInitializer(GameRepository gameRepository, ReportRepository reportRepository, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            userRepository.save(new User("annie", "annie@ucll.be", passwordEncoder.encode("password123)")));
            userRepository.save(new User("sundae", "sundae@ucll.be", passwordEncoder.encode("password123")));
            userRepository.save(new User("enis", "enis@ucll.be", passwordEncoder.encode("password123")));
        }
        if (gameRepository.count() == 0) {
            gameRepository.save(new Game(570, "Dota 2"));
            gameRepository.save(new Game(271590, "Grand Theft Auto V"));
            gameRepository.save(new Game(1145360, "Hades"));
            gameRepository.save(new Game(367520, "Hollow Knight"));
            gameRepository.save(new Game(413150, "Stardew Valley"));
            gameRepository.save(new Game(1086940, "Baldur's Gate 3"));
        }

        if (reportRepository.count() == 0) {
            User annie = userRepository.findByUsername("annie").orElseThrow();
            User sundae = userRepository.findByUsername("sundae").orElseThrow();
            Game dota = gameRepository.findBySteamAppid(570).orElseThrow();
            Game stardew = gameRepository.findBySteamAppid(413150).orElseThrow();

            reportRepository.save(new Report(annie, dota, Tier.Gold, "Ubuntu"));
            reportRepository.save(new Report(annie, dota, Tier.Platinum, "SteamOS"));
            reportRepository.save(new Report(sundae, stardew, Tier.Platinum, "Ubuntu"));
        }
    }
}