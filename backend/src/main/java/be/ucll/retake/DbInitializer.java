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

            // =====================================================
            // EXISTING GAMES
            // =====================================================

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
            gtaiii.addAlias("GTA 3");
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


            // =====================================================
            // EXPANDED GAME CATALOGUE
            // =====================================================

            Game isaac = new Game(250900, "The Binding of Isaac: Rebirth");
            isaac.addAlias("The Binding of Isaac");
            isaac.addAlias("Binding of Isaac");
            isaac.addAlias("Isaac");
            isaac.addGenre("Action");
            isaac.addGenre("Roguelike");
            isaac.addGenre("RPG");
            gameRepository.save(isaac);

            Game rainbowSix = new Game(359550, "Tom Clancy's Rainbow Six Siege");
            rainbowSix.addAlias("Rainbow Six Siege");
            rainbowSix.addAlias("R6");
            rainbowSix.addAlias("R6 Siege");
            rainbowSix.addGenre("Action");
            rainbowSix.addGenre("Shooter");
            rainbowSix.addGenre("Multiplayer");
            gameRepository.save(rainbowSix);

            Game destiny2 = new Game(1085660, "Destiny 2");
            destiny2.addAlias("Destiny");
            destiny2.addGenre("Action");
            destiny2.addGenre("Shooter");
            destiny2.addGenre("Multiplayer");
            destiny2.addGenre("RPG");
            gameRepository.save(destiny2);

            Game pubg = new Game(578080, "PUBG: BATTLEGROUNDS");
            pubg.addAlias("PUBG");
            pubg.addAlias("PlayerUnknown's Battlegrounds");
            pubg.addGenre("Action");
            pubg.addGenre("Shooter");
            pubg.addGenre("Battle Royale");
            pubg.addGenre("Multiplayer");
            gameRepository.save(pubg);

            Game witcher3 = new Game(292030, "The Witcher 3: Wild Hunt");
            witcher3.addAlias("The Witcher 3");
            witcher3.addAlias("Witcher 3");
            witcher3.addGenre("RPG");
            witcher3.addGenre("Adventure");
            witcher3.addGenre("Open World");
            gameRepository.save(witcher3);

            Game rdr2 = new Game(1174180, "Red Dead Redemption 2");
            rdr2.addAlias("RDR2");
            rdr2.addAlias("Red Dead 2");
            rdr2.addGenre("Action");
            rdr2.addGenre("Adventure");
            rdr2.addGenre("Open World");
            gameRepository.save(rdr2);

            Game godOfWar = new Game(1593500, "God of War");
            godOfWar.addAlias("GOW");
            godOfWar.addAlias("God of War 2018");
            godOfWar.addGenre("Action");
            godOfWar.addGenre("Adventure");
            godOfWar.addGenre("RPG");
            gameRepository.save(godOfWar);

            Game godOfWarRagnarok = new Game(2322010, "God of War Ragnarök");
            godOfWarRagnarok.addAlias("God of War Ragnarok");
            godOfWarRagnarok.addAlias("GOW Ragnarok");
            godOfWarRagnarok.addAlias("GOWR");
            godOfWarRagnarok.addGenre("Action");
            godOfWarRagnarok.addGenre("Adventure");
            godOfWarRagnarok.addGenre("RPG");
            gameRepository.save(godOfWarRagnarok);

            Game rdr = new Game(2668510, "Red Dead Redemption");
            rdr.addAlias("RDR");
            rdr.addAlias("Red Dead Redemption 1");
            rdr.addAlias("RDR1");
            rdr.addGenre("Action");
            rdr.addGenre("Adventure");
            rdr.addGenre("Open World");
            gameRepository.save(rdr);

            Game anomalyAgent = new Game(2378620, "Anomaly Agent");
            anomalyAgent.addAlias("Anomally Agent");
            anomalyAgent.addGenre("Action");
            anomalyAgent.addGenre("Adventure");
            anomalyAgent.addGenre("Platformer");
            gameRepository.save(anomalyAgent);

            Game alanWake = new Game(108710, "Alan Wake");
            alanWake.addGenre("Action");
            alanWake.addGenre("Adventure");
            alanWake.addGenre("Horror");
            gameRepository.save(alanWake);

            Game deathStranding = new Game(1190460, "DEATH STRANDING");
            deathStranding.addAlias("Death Stranding");
            deathStranding.addGenre("Action");
            deathStranding.addGenre("Adventure");
            deathStranding.addGenre("Open World");
            gameRepository.save(deathStranding);

            Game deathStranding2 = new Game(3280350, "DEATH STRANDING 2: ON THE BEACH");
            deathStranding2.addAlias("Death Stranding 2");
            deathStranding2.addAlias("DS2");
            deathStranding2.addGenre("Action");
            deathStranding2.addGenre("Adventure");
            deathStranding2.addGenre("Open World");
            gameRepository.save(deathStranding2);

            Game deathStrandingDC =
                    new Game(1850570, "DEATH STRANDING DIRECTOR'S CUT");
            deathStrandingDC.addAlias("Death Stranding Director's Cut");
            deathStrandingDC.addAlias("Death Stranding DC");
            deathStrandingDC.addGenre("Action");
            deathStrandingDC.addGenre("Adventure");
            deathStrandingDC.addGenre("Open World");
            gameRepository.save(deathStrandingDC);

            Game viceCity = new Game(12110, "Grand Theft Auto: Vice City");
            viceCity.addAlias("GTA Vice City");
            viceCity.addAlias("Vice City");
            viceCity.addGenre("Action");
            viceCity.addGenre("Adventure");
            viceCity.addGenre("Open World");
            gameRepository.save(viceCity);

            Game sanAndreas = new Game(12120, "Grand Theft Auto: San Andreas");
            sanAndreas.addAlias("GTA San Andreas");
            sanAndreas.addAlias("GTA SA");
            sanAndreas.addAlias("San Andreas");
            sanAndreas.addGenre("Action");
            sanAndreas.addGenre("Adventure");
            sanAndreas.addGenre("Open World");
            gameRepository.save(sanAndreas);

            Game hunt = new Game(594650, "Hunt: Showdown 1896");
            hunt.addAlias("Hunt Showdown");
            hunt.addAlias("Hunt");
            hunt.addGenre("Action");
            hunt.addGenre("Shooter");
            hunt.addGenre("Horror");
            hunt.addGenre("Multiplayer");
            gameRepository.save(hunt);

            Game warzone = new Game(1938090, "Call of Duty");
            warzone.addAlias("Call of Duty Warzone");
            warzone.addAlias("Warzone");
            warzone.addAlias("COD Warzone");
            warzone.addGenre("Action");
            warzone.addGenre("Shooter");
            warzone.addGenre("Battle Royale");
            warzone.addGenre("Multiplayer");
            gameRepository.save(warzone);

            Game fc26 = new Game(3405690, "EA SPORTS FC 26");
            fc26.addAlias("FC 26");
            fc26.addAlias("FIFA 26");
            fc26.addAlias("EA FC 26");
            fc26.addGenre("Sports");
            fc26.addGenre("Simulation");
            gameRepository.save(fc26);

            Game inside = new Game(304430, "INSIDE");
            inside.addAlias("Inside");
            inside.addGenre("Adventure");
            inside.addGenre("Puzzle");
            inside.addGenre("Platformer");
            gameRepository.save(inside);

            Game control = new Game(870780, "Control Ultimate Edition");
            control.addAlias("Control");
            control.addGenre("Action");
            control.addGenre("Adventure");
            control.addGenre("Shooter");
            gameRepository.save(control);

            Game tlou1 = new Game(1888930, "The Last of Us Part I");
            tlou1.addAlias("The Last of Us");
            tlou1.addAlias("TLOU");
            tlou1.addAlias("TLOU 1");
            tlou1.addAlias("The Last of Us 1");
            tlou1.addAlias("The Last of Us Left Behind");
            tlou1.addGenre("Action");
            tlou1.addGenre("Adventure");
            tlou1.addGenre("Horror");
            gameRepository.save(tlou1);

            Game tlou2 = new Game(2531310, "The Last of Us Part II Remastered");
            tlou2.addAlias("The Last of Us 2");
            tlou2.addAlias("The Last of Us Part II");
            tlou2.addAlias("TLOU 2");
            tlou2.addAlias("TLOU2");
            tlou2.addGenre("Action");
            tlou2.addGenre("Adventure");
            tlou2.addGenre("Horror");
            gameRepository.save(tlou2);

            Game bioshock = new Game(7670, "BioShock");
            bioshock.addAlias("BioShock 1");
            bioshock.addGenre("Action");
            bioshock.addGenre("Shooter");
            bioshock.addGenre("Horror");
            gameRepository.save(bioshock);

            Game bioshock2 = new Game(8850, "BioShock 2");
            bioshock2.addGenre("Action");
            bioshock2.addGenre("Shooter");
            bioshock2.addGenre("Horror");
            gameRepository.save(bioshock2);

            Game bioshockInfinite = new Game(8870, "BioShock Infinite");
            bioshockInfinite.addAlias("BioShock 3");
            bioshockInfinite.addGenre("Action");
            bioshockInfinite.addGenre("Shooter");
            bioshockInfinite.addGenre("Adventure");
            gameRepository.save(bioshockInfinite);
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
                reportRepository.save(
                        new Report(
                                annie,
                                dota,
                                Tier.Gold,
                                "Ubuntu " + i,
                                "Test report number " + i,
                                "Proton 9.0-3"
                        )
                );
            }
        }
    }
}