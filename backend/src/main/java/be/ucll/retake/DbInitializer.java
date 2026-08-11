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

    public DbInitializer(
            GameRepository gameRepository,
            ReportRepository reportRepository,
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.gameRepository = gameRepository;
        this.userRepository = userRepository;
        this.reportRepository = reportRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.count() == 0) {
            userRepository.save(
                    new User(
                            "annie",
                            "annie@ucll.be",
                            passwordEncoder.encode("password123")
                    )
            );

            userRepository.save(
                    new User(
                            "sundae",
                            "sundae@ucll.be",
                            passwordEncoder.encode("password123")
                    )
            );

            userRepository.save(
                    new User(
                            "enis",
                            "enis@ucll.be",
                            passwordEncoder.encode("password123")
                    )
            );
        }

        if (gameRepository.count() == 0) {

            Game dota = new Game(570, "Dota 2");
            dota.addAlias("Dota");
            dota.addGenre("Action");
            dota.addGenre("Strategy");
            dota.addGenre("MOBA");
            gameRepository.save(dota);

            Game gtav = new Game(271590, "Grand Theft Auto V");
            gtav.addAlias("GTA V");
            gtav.addAlias("GTA 5");
            gtav.addGenre("Action");
            gtav.addGenre("Adventure");
            gtav.addGenre("Open World");
            gameRepository.save(gtav);

            Game gtaiv = new Game(12210, "Grand Theft Auto IV");
            gtaiv.addAlias("GTA IV");
            gtaiv.addAlias("GTA 4");
            gtaiv.addGenre("Action");
            gtaiv.addGenre("Adventure");
            gtaiv.addGenre("Open World");
            gameRepository.save(gtaiv);

            Game gtaiii = new Game(12100, "Grand Theft Auto III");
            gtaiii.addAlias("GTA III");
            gtaiv.addAlias("GTA 3");
            gtaiii.addGenre("Action");
            gtaiii.addGenre("Adventure");
            gtaiii.addGenre("Open World");
            gameRepository.save(gtaiii);

            Game hades = new Game(1145360, "Hades");
            hades.addGenre("Action");
            hades.addGenre("Roguelike");
            hades.addGenre("RPG");
            gameRepository.save(hades);

            Game hades2 = new Game(1145350, "Hades II");
            hades2.addAlias("Hades 2");
            hades2.addGenre("Action");
            hades2.addGenre("Roguelike");
            hades2.addGenre("RPG");
            gameRepository.save(hades2);

            Game hollowKnight = new Game(367520, "Hollow Knight");
            hollowKnight.addGenre("Action");
            hollowKnight.addGenre("Adventure");
            hollowKnight.addGenre("Metroidvania");
            gameRepository.save(hollowKnight);

            Game stardew = new Game(413150, "Stardew Valley");
            stardew.addGenre("Simulation");
            stardew.addGenre("RPG");
            gameRepository.save(stardew);

            Game bg3 = new Game(1086940, "Baldur's Gate 3");
            bg3.addAlias("BG3");
            bg3.addGenre("RPG");
            bg3.addGenre("Adventure");
            bg3.addGenre("Strategy");
            gameRepository.save(bg3);

            Game bg1 = new Game(228280, "Baldur's Gate");
            bg1.addAlias("Baldur's Gate 1");
            bg1.addAlias("BG1");
            bg1.addGenre("RPG");
            bg1.addGenre("Adventure");
            bg1.addGenre("Strategy");
            gameRepository.save(bg1);
        }

        if (reportRepository.count() == 0) {

            User annie = userRepository
                    .findByUsername("annie")
                    .orElseThrow();

            User sundae = userRepository
                    .findByUsername("sundae")
                    .orElseThrow();

            User enis = userRepository
                    .findByUsername("enis")
                    .orElseThrow();

            Game dota = gameRepository
                    .findBySteamAppid(570)
                    .orElseThrow();

            Game gtav = gameRepository
                    .findBySteamAppid(271590)
                    .orElseThrow();

            Game gtaiv = gameRepository
                    .findBySteamAppid(12210)
                    .orElseThrow();

            Game gtaiii = gameRepository
                    .findBySteamAppid(12100)
                    .orElseThrow();

            Game hades = gameRepository
                    .findBySteamAppid(1145360)
                    .orElseThrow();

            Game hades2 = gameRepository
                    .findBySteamAppid(1145350)
                    .orElseThrow();

            Game hollowKnight = gameRepository
                    .findBySteamAppid(367520)
                    .orElseThrow();

            Game stardew = gameRepository
                    .findBySteamAppid(413150)
                    .orElseThrow();

            Game bg3 = gameRepository
                    .findBySteamAppid(1086940)
                    .orElseThrow();

            Game bg1 = gameRepository
                    .findBySteamAppid(228280)
                    .orElseThrow();

            reportRepository.save(
                    new Report(
                            enis,
                            dota,
                            Tier.Gold,
                            "Ubuntu",
                            "Runs great out of the box, minor stutter on load screens.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            enis,
                            dota,
                            Tier.Platinum,
                            "SteamOS",
                            "Flawless on Steam Deck, no tweaks needed.",
                            "Proton Experimental"
                    )
            );

            reportRepository.save(
                    new Report(
                            enis,
                            gtav,
                            Tier.Silver,
                            "Fedora",
                            "Playable but needs tweaks — occasional crashes in online mode.",
                            "Proton 8.0-5"
                    )
            );

            reportRepository.save(
                    new Report(
                            annie,
                            gtav,
                            Tier.Gold,
                            "Ubuntu",
                            "Story mode runs perfectly. Online is hit or miss.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            sundae,
                            gtaiv,
                            Tier.Bronze,
                            "Arch",
                            "Runs, but frequent frame drops and audio crackle. Needs work.",
                            "Proton 8.0-5"
                    )
            );

            reportRepository.save(
                    new Report(
                            enis,
                            gtaiii,
                            Tier.Gold,
                            "Ubuntu",
                            "Old game, runs great with a community patch.",
                            "Proton 7.0-6"
                    )
            );

            reportRepository.save(
                    new Report(
                            sundae,
                            hades,
                            Tier.Platinum,
                            "Arch",
                            "Perfect, runs better than on Windows honestly.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            annie,
                            hades,
                            Tier.Platinum,
                            "Ubuntu",
                            "Zero issues, native-feeling performance.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            annie,
                            hades2,
                            Tier.Gold,
                            "SteamOS",
                            "Early access but very smooth on the Deck.",
                            "Proton Experimental"
                    )
            );

            reportRepository.save(
                    new Report(
                            sundae,
                            hollowKnight,
                            Tier.Platinum,
                            "Ubuntu",
                            "Runs flawlessly, one of the best Linux experiences.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            annie,
                            stardew,
                            Tier.Gold,
                            "Ubuntu",
                            "Very pleasant experience.\n\n"
                                    + "I launched the game with Proton because it was the easiest way "
                                    + "I found to install the Stardew Valley Very Expanded (SVVE) mod. "
                                    + "Everything works perfectly, including multiplayer!",
                            "Custom Proton: GE-Proton10-34"
                    )
            );

            reportRepository.save(
                    new Report(
                            sundae,
                            stardew,
                            Tier.Platinum,
                            "SteamOS",
                            "Perfect on the Steam Deck, no setup needed.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            enis,
                            bg3,
                            Tier.Gold,
                            "Ubuntu",
                            "Runs beautifully after the latest Proton update. "
                                    + "Long load times on older drives.",
                            "Proton 9.0-3"
                    )
            );

            reportRepository.save(
                    new Report(
                            annie,
                            bg3,
                            Tier.Platinum,
                            "SteamOS",
                            "Steam Deck verified for a reason — flawless.",
                            "Proton Experimental"
                    )
            );

            reportRepository.save(
                    new Report(
                            sundae,
                            bg1,
                            Tier.Platinum,
                            "Arch",
                            "Classic runs perfectly through the Enhanced Edition.",
                            "Proton 8.0-5"
                    )
            );

                for (int i = 0; i < 15; i++) {
                        reportRepository.save(new Report(annie, dota, Tier.Gold, "Ubuntu " + i, "Test report number " + i, "Proton 9.0-3"));
                }
        }
    }
}