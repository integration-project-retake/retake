package be.ucll.retake;

import be.ucll.retake.model.Game;
import be.ucll.retake.model.Report;
import be.ucll.retake.model.Tier;
import be.ucll.retake.model.User;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;
import be.ucll.retake.repository.UserRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@Profile("!test")
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
            userRepository.save(new User("annie", "annie@ucll.be", passwordEncoder.encode("password123")));
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
            User enis = userRepository.findByUsername("enis").orElseThrow();
            Game dota = gameRepository.findBySteamAppid(570).orElseThrow();
            Game stardew = gameRepository.findBySteamAppid(413150).orElseThrow();
            Game hollowknight = gameRepository.findBySteamAppid(367520).orElseThrow();
            Game gtav = gameRepository.findBySteamAppid(271590).orElseThrow();
            Game hades = gameRepository.findBySteamAppid(1145360).orElseThrow();
            
            
            reportRepository.save(new Report(sundae, hades, Tier.Platinum, "Arch",
                "Perfect, runs better than on Windows honestly -w-", "Proton 9.0-3"));
            reportRepository.save(new Report(annie, stardew, Tier.Gold, "Ubuntu", "Very pleasant experience.\n" +
                                "\n" + //
                                "I launched the game with Proton because it was the easiest way I found to install the Stardew Valley Very Expanded (SVVE) mod. Everything works perfectly, including multiplayer!", "Custom Proton: GE-Proton10-34"));
            reportRepository.save(new Report(annie, stardew, Tier.Platinum, "SteamOS"));
            reportRepository.save(new Report(sundae, hollowknight, Tier.Platinum, "Ubuntu"));
            reportRepository.save(new Report(enis, dota, Tier.Gold, "Ubuntu",
                "Runs great out of the box, minor stutter on load screens.", "Proton 9.0-3"));
            reportRepository.save(new Report(enis, dota, Tier.Platinum, "SteamOS",
                "Flawless on Steam Deck, no tweaks needed.", "Proton Experimental"));
        }
    }
}
