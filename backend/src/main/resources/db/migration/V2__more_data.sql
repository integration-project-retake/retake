-- Insert New Users
INSERT INTO users (username, email, password) VALUES
('neon_tux', 'neon@example.com', crypt('password123', gen_salt('bf'))),
('arch_btw', 'arch@example.com', crypt('password123', gen_salt('bf'))),
('deck_player', 'deck@example.com', crypt('password123', gen_salt('bf'))),
('void_walker', 'void@example.com', crypt('password123', gen_salt('bf')));

-- Insert New Games
INSERT INTO games (steam_appid, name) VALUES
(1172470, 'Apex Legends'),
(1245620, 'ELDEN RING'),
(1091500, 'Cyberpunk 2077'),
(2536700, 'HELLDIVERS 2'),
(730, 'Counter-Strike 2'),
(1966720, 'Lethal Company'),
(105600, 'Terraria'),
(1623730, 'Palworld'),
(550, 'Left 4 Dead 2'),
(582010, 'Monster Hunter: World'),
(489830, 'The Elder Scrolls V: Skyrim Special Edition'),
(377160, 'Fallout 4'),
(1687950, 'Persona 5 Royal'),
(814380, 'Sekiro: Shadows Die Twice'),
(2050650, 'Resident Evil 4'),
(39210, 'FINAL FANTASY XIV Online'),
(275850, 'No Man''s Sky'),
(381210, 'Dead by Daylight'),
(230410, 'Warframe'),
(4000, 'Garry''s Mod'),
(1332010, 'Stray'),
(221100, 'DayZ'),
(289070, 'Sid Meier''s Civilization VI'),
(252490, 'Rust');

-- Insert Aliases for New Games
INSERT INTO game_aliases (game_id, alias)
SELECT g.id, t.alias
FROM (VALUES
    (1172470::int, 'Apex'), (1245620, 'Elden Ring'), (1091500, 'Cyberpunk'), (1091500, 'CP2077'),
    (2536700, 'Helldivers'), (2536700, 'HD2'), (730, 'CS2'), (730, 'CS:GO'), (730, 'Counter-Strike'),
    (1623730, 'Pokemon with guns'), (582010, 'MHW'), (489830, 'Skyrim'), (489830, 'Skyrim SE'),
    (1687950, 'P5R'), (1687950, 'Persona 5'), (814380, 'Sekiro'), (2050650, 'RE4 Remake'), (2050650, 'RE4'),
    (39210, 'FFXIV'), (39210, 'Final Fantasy 14'), (275850, 'NMS'), (381210, 'DBD'), (289070, 'Civ 6'), (289070, 'Civilization 6')
) AS t(app_id, alias)
JOIN games g ON g.steam_appid = t.app_id;

-- Insert Genres for New Games
INSERT INTO game_genres (game_id, genre)
SELECT g.id, t.genre
FROM (VALUES
    (1172470::int, 'Action'::varchar), (1172470, 'Shooter'), (1172470, 'Battle Royale'), (1172470, 'Multiplayer'),
    (1245620, 'Action'), (1245620, 'RPG'), (1245620, 'Open World'),
    (1091500, 'Action'), (1091500, 'RPG'), (1091500, 'Open World'), (1091500, 'Sci-Fi'),
    (2536700, 'Action'), (2536700, 'Shooter'), (2536700, 'Multiplayer'),
    (730, 'Action'), (730, 'Shooter'), (730, 'Multiplayer'),
    (1966720, 'Action'), (1966720, 'Horror'), (1966720, 'Multiplayer'),
    (105600, 'Action'), (105600, 'Adventure'), (105600, 'RPG'), (105600, 'Sandbox'),
    (1623730, 'Action'), (1623730, 'Adventure'), (1623730, 'Survival'),
    (550, 'Action'), (550, 'Shooter'), (550, 'Horror'), (550, 'Multiplayer'),
    (582010, 'Action'), (582010, 'RPG'), (582010, 'Multiplayer'),
    (489830, 'RPG'), (489830, 'Adventure'), (489830, 'Open World'),
    (377160, 'RPG'), (377160, 'Shooter'), (377160, 'Open World'),
    (1687950, 'RPG'), (1687950, 'Story Rich'),
    (814380, 'Action'), (814380, 'Adventure'),
    (2050650, 'Action'), (2050650, 'Horror'),
    (39210, 'RPG'), (39210, 'MMO'), (39210, 'Multiplayer'),
    (275850, 'Action'), (275850, 'Adventure'), (275850, 'Survival'), (275850, 'Sci-Fi'),
    (381210, 'Action'), (381210, 'Horror'), (381210, 'Multiplayer'),
    (230410, 'Action'), (230410, 'Shooter'), (230410, 'Multiplayer'), (230410, 'Sci-Fi'),
    (4000, 'Simulation'), (4000, 'Sandbox'),
    (1332010, 'Adventure'), (1332010, 'Puzzle'),
    (221100, 'Action'), (221100, 'Survival'), (221100, 'Multiplayer'), (221100, 'Open World'),
    (289070, 'Strategy'), (289070, 'Turn-Based'),
    (252490, 'Action'), (252490, 'Survival'), (252490, 'Multiplayer')
) AS t(app_id, genre)
JOIN games g ON g.steam_appid = t.app_id;

-- Insert Reports
INSERT INTO reports (user_id, game_id, tier, distribution, comment, proton_version)
SELECT u.id, g.id, r.t, r.d, r.c, r.p
FROM (VALUES
    -- Anti-cheat / Borked Reports (from V1 and V2)
    ('neon_tux'::varchar, 359550::int, 'Borked'::varchar, 'Arch'::varchar, 'BattlEye kicks you immediately upon entering a multiplayer match. Do not attempt.'::varchar, 'Proton Experimental'::varchar),
    ('arch_btw', 1085660, 'Borked', 'Debian', 'Game fails to launch. Bungie explicitly bans Linux/Proton users. Stay away.', 'Proton 9.0-3'),
    ('deck_player', 578080, 'Borked', 'SteamOS', 'Anti-cheat prevents matchmaking entirely.', 'Proton 9.0-3'),
    ('void_walker', 3405690, 'Borked', 'Ubuntu', 'EA Anticheat instantly blocks the game from starting.', 'Proton 9.0-3'),
    ('arch_btw', 1938090, 'Borked', 'Debian', 'Ricochet anti-cheat makes this completely unplayable on Linux.', 'Proton Experimental'),
    ('neon_tux', 252490, 'Bronze', 'Arch', 'EAC works on some modded community servers, but official servers will instantly kick you.', 'Proton 9.0-3'),
    ('void_walker', 252490, 'Borked', 'Ubuntu', 'Cannot play on official servers at all due to EAC.', 'Proton 9.0-3'),
    ('deck_player', 252490, 'Bronze', 'SteamOS', 'Playable only on unprotected servers. UI is a bit small.', 'Proton Experimental'),
    ('arch_btw', 252490, 'Borked', 'Debian', 'EAC prevents joining 99% of servers.', 'Proton 8.0-5'),
    ('neon_tux', 252490, 'Bronze', 'Pop!_OS', 'Only useful for server administration, not actually playing.', 'Proton 9.0-3'),

    -- Apex Legends (1172470)
    ('deck_player', 1172470, 'Platinum', 'SteamOS', 'EAC works natively on Steam Deck. Locked 60fps.', 'Proton Experimental'),
    ('arch_btw', 1172470, 'Platinum', 'Arch', 'Flawless with Proton Experimental. Immediate matchmaking.', 'Proton Experimental'),
    ('void_walker', 1172470, 'Gold', 'Ubuntu', 'Occasional stutter before shaders fully compile, then smooth.', 'Proton 9.0-3'),
    ('neon_tux', 1172470, 'Gold', 'Fedora', 'Smooth after initial cache build. No crashes.', 'Proton 8.0-5'),
    ('deck_player', 1172470, 'Silver', 'Debian', 'Some audio crackling, fixable with PulseAudio tweaks.', 'Proton 9.0-3'),

    -- ELDEN RING (1245620)
    ('void_walker', 1245620, 'Platinum', 'Ubuntu', 'Plays flawlessly out of the box. EAC works fine for multiplayer.', 'Proton 9.0-3'),
    ('deck_player', 1245620, 'Platinum', 'SteamOS', 'Locked 40fps is great on the OLED Deck.', 'Proton Experimental'),
    ('arch_btw', 1245620, 'Gold', 'Arch', 'Requires minor tweaks for ultrawide, otherwise perfect.', 'Proton 9.0-3'),
    ('neon_tux', 1245620, 'Gold', 'Linux Mint', 'EAC works perfectly for multiplayer and co-op mods.', 'Proton Experimental'),
    ('void_walker', 1245620, 'Silver', 'Debian', 'Controller hotplugging issues require restarting the game.', 'Proton 8.0-5'),

    -- Cyberpunk 2077 (1091500)
    ('neon_tux', 1091500, 'Gold', 'Arch', 'Runs exceptionally well. Use PROTON_ENABLE_NVAPI=1 for DLSS support.', 'Proton Experimental'),
    ('deck_player', 1091500, 'Gold', 'SteamOS', 'Great on Deck with FSR enabled. Steady 30fps.', 'Proton 9.0-3'),
    ('arch_btw', 1091500, 'Platinum', 'Fedora', 'Latest Proton fixes all previous audio glitches.', 'Proton Experimental'),
    ('void_walker', 1091500, 'Gold', 'Ubuntu', 'Smooth 60fps on medium settings.', 'Proton 9.0-3'),
    ('neon_tux', 1091500, 'Silver', 'Pop!_OS', 'Occasional crashes during long play sessions in Dogtown.', 'Proton 8.0-5'),

    -- HELLDIVERS 2 (2536700)
    ('arch_btw', 2536700, 'Gold', 'Debian', 'Gameguard works. Occasional disconnects but otherwise smooth.', 'Proton 9.0-3'),
    ('neon_tux', 2536700, 'Platinum', 'Arch', 'Flawless with latest Proton GE.', 'Custom Proton: GE-Proton'),
    ('deck_player', 2536700, 'Gold', 'SteamOS', 'Very playable, drops frames on high difficulties.', 'Proton Experimental'),
    ('void_walker', 2536700, 'Silver', 'Ubuntu', 'Matchmaking takes longer than Windows sometimes.', 'Proton 9.0-3'),
    ('arch_btw', 2536700, 'Gold', 'Fedora', 'Smooth once shaders compile completely.', 'Proton Experimental'),

    -- Counter-Strike 2 (730)
    ('deck_player', 730, 'Platinum', 'SteamOS', 'Forcing Proton fixes input lag completely.', 'Proton Experimental'),
    ('arch_btw', 730, 'Platinum', 'Arch', 'No input lag with Proton Experimental.', 'Proton Experimental'),
    ('void_walker', 730, 'Gold', 'Ubuntu', 'Requires -vulkan flag for best performance in my setup.', 'Proton 9.0-3'),
    ('neon_tux', 730, 'Gold', 'Fedora', 'Smooth, but requires manual shader cache disable.', 'Proton 8.0-5'),
    ('deck_player', 730, 'Silver', 'Debian', 'Occasional frame drops in smoke grenades.', 'Proton 9.0-3'),

    -- Lethal Company (1966720)
    ('void_walker', 1966720, 'Platinum', 'Ubuntu', 'Works perfectly. Voice chat and mods function without any extra configuration.', 'Proton 9.0-3'),
    ('deck_player', 1966720, 'Platinum', 'SteamOS', 'Great battery life, zero issues.', 'Proton Experimental'),
    ('arch_btw', 1966720, 'Platinum', 'Arch', 'Mods work perfectly through r2modman.', 'Proton 9.0-3'),
    ('neon_tux', 1966720, 'Gold', 'Debian', 'Minor audio crackle when multiple people scream.', 'Proton 8.0-5'),
    ('void_walker', 1966720, 'Platinum', 'Pop!_OS', 'Flawless multiplayer experience.', 'Proton Experimental'),

    -- Terraria (105600)
    ('neon_tux', 105600, 'Platinum', 'Arch', 'Runs flawlessly via Proton. No issues at all.', 'Proton 9.0-3'),
    ('deck_player', 105600, 'Platinum', 'SteamOS', 'Perfect for handheld play.', 'Proton Experimental'),
    ('void_walker', 105600, 'Platinum', 'Ubuntu', 'Zero configuration needed. Out of the box perfection.', 'Proton 9.0-3'),
    ('arch_btw', 105600, 'Gold', 'Fedora', 'tModLoader requires a separate Proton prefix sometimes.', 'Proton 8.0-5'),
    ('neon_tux', 105600, 'Platinum', 'Linux Mint', 'Smooth 60fps always.', 'Proton 9.0-3'),

    -- Palworld (1623730)
    ('arch_btw', 1623730, 'Gold', 'Debian', 'Runs well, but memory leaks require restarting every few hours.', 'Proton Experimental'),
    ('deck_player', 1623730, 'Gold', 'SteamOS', 'Playable on low settings, ~40fps.', 'Proton 9.0-3'),
    ('neon_tux', 1623730, 'Silver', 'Arch', 'Multiplayer servers have high latency occasionally.', 'Proton 8.0-5'),
    ('void_walker', 1623730, 'Gold', 'Ubuntu', 'Solid 60fps, some graphical glitches on water.', 'Proton Experimental'),
    ('arch_btw', 1623730, 'Bronze', 'Pop!_OS', 'Frequent crashes during large base building.', 'Proton 9.0-3'),

    -- Left 4 Dead 2 (550)
    ('deck_player', 550, 'Platinum', 'SteamOS', 'Forcing Proton fixes missing textures completely.', 'Proton Experimental'),
    ('arch_btw', 550, 'Platinum', 'Arch', 'Flawless with Proton 9.', 'Proton 9.0-3'),
    ('void_walker', 550, 'Platinum', 'Ubuntu', 'Runs beautifully at high refresh rates.', 'Proton 9.0-3'),
    ('neon_tux', 550, 'Gold', 'Fedora', 'Custom campaigns load perfectly.', 'Proton 8.0-5'),
    ('deck_player', 550, 'Platinum', 'Debian', 'Zero issues with controller or mouse/keyboard.', 'Proton Experimental'),

    -- Monster Hunter: World (582010)
    ('void_walker', 582010, 'Gold', 'Ubuntu', 'Solid 60fps. Sometimes requires deleting the compatdata folder after a major update.', 'Proton 8.0-5'),
    ('deck_player', 582010, 'Platinum', 'SteamOS', 'Great on Deck, stable framerate.', 'Proton Experimental'),
    ('arch_btw', 582010, 'Gold', 'Arch', 'Requires GE-Proton for some specific cutscenes to render.', 'Custom Proton: GE-Proton'),
    ('neon_tux', 582010, 'Silver', 'Fedora', 'Multiplayer disconnects randomly for me.', 'Proton 9.0-3'),
    ('void_walker', 582010, 'Gold', 'Pop!_OS', 'Smooth gameplay, heavy CPU usage though.', 'Proton 9.0-3'),

    -- Skyrim SE (489830)
    ('neon_tux', 489830, 'Platinum', 'Arch', 'Flawless. Modding requires setting up SteamTinkerLaunch but gameplay is perfect.', 'Proton 9.0-3'),
    ('deck_player', 489830, 'Platinum', 'SteamOS', 'Perfect battery life and performance.', 'Proton Experimental'),
    ('void_walker', 489830, 'Gold', 'Ubuntu', 'Audio requires xaudio overrides sometimes for mods.', 'Proton 8.0-5'),
    ('arch_btw', 489830, 'Gold', 'Debian', 'SKSE works perfectly with custom launch options.', 'Proton 9.0-3'),
    ('neon_tux', 489830, 'Platinum', 'Fedora', 'Runs out of the box with zero tweaks required.', 'Proton Experimental'),

    -- Fallout 4 (377160)
    ('arch_btw', 377160, 'Gold', 'Debian', 'Weapon debris must be turned off in launcher or it crashes instantly.', 'Proton 9.0-3'),
    ('deck_player', 377160, 'Platinum', 'SteamOS', 'Runs smoothly at 60fps. Great for handheld.', 'Proton Experimental'),
    ('neon_tux', 377160, 'Gold', 'Arch', 'Modding takes some effort but works well once setup.', 'Proton 9.0-3'),
    ('void_walker', 377160, 'Silver', 'Pop!_OS', 'Occasional physics bugs tied to framerate un-capping.', 'Proton 8.0-5'),
    ('arch_btw', 377160, 'Gold', 'Ubuntu', 'Great performance out of the box. No crashes yet.', 'Proton Experimental'),

    -- Persona 5 Royal (1687950)
    ('deck_player', 1687950, 'Platinum', 'SteamOS', 'Zero issues. Cutscenes and audio work perfectly.', 'Proton Experimental'),
    ('arch_btw', 1687950, 'Platinum', 'Arch', 'Flawless 120fps on my desktop.', 'Proton 9.0-3'),
    ('void_walker', 1687950, 'Platinum', 'Ubuntu', 'Perfect out of the box experience.', 'Proton 9.0-3'),
    ('neon_tux', 1687950, 'Platinum', 'Fedora', 'No configuration required at all.', 'Proton 8.0-5'),
    ('deck_player', 1687950, 'Gold', 'Debian', 'Minor stuttering during screen transitions, otherwise great.', 'Proton Experimental'),

    -- Sekiro: Shadows Die Twice (814380)
    ('void_walker', 814380, 'Platinum', 'Ubuntu', 'Flawless frame pacing without any tweaks.', 'Proton 9.0-3'),
    ('deck_player', 814380, 'Platinum', 'SteamOS', 'Locked 60fps, perfect for Deck.', 'Proton Experimental'),
    ('arch_btw', 814380, 'Gold', 'Arch', 'Requires controller remapping occasionally through Steam Input.', 'Proton 9.0-3'),
    ('neon_tux', 814380, 'Platinum', 'Linux Mint', 'Smooth and extremely responsive.', 'Proton 8.0-5'),
    ('void_walker', 814380, 'Gold', 'Pop!_OS', 'Runs perfectly, minor shader compilation stutter early on.', 'Proton Experimental'),

    -- Resident Evil 4 (2050650)
    ('neon_tux', 2050650, 'Gold', 'Arch', 'Requires PROTON_ENABLE_NVAPI=1. Ray tracing causes crashes, keep it off.', 'Proton Experimental'),
    ('deck_player', 2050650, 'Gold', 'SteamOS', 'Playable on medium/low settings, 40fps lock recommended.', 'Proton 9.0-3'),
    ('void_walker', 2050650, 'Platinum', 'Ubuntu', 'Flawless with Ray Tracing turned off.', 'Proton 9.0-3'),
    ('arch_btw', 2050650, 'Silver', 'Debian', 'Crashes in inventory screen sometimes. Needs fix.', 'Proton 8.0-5'),
    ('neon_tux', 2050650, 'Gold', 'Fedora', 'Solid performance throughout the entire campaign.', 'Proton Experimental'),

    -- FINAL FANTASY XIV Online (39210)
    ('arch_btw', 39210, 'Gold', 'Debian', 'Use XIVLauncher from Flathub instead of the standard Steam launcher for the best experience.', 'Custom Proton: GE-Proton'),
    ('neon_tux', 39210, 'Platinum', 'Arch', 'Flawless with custom launcher.', 'Custom Proton: GE-Proton'),
    ('deck_player', 39210, 'Platinum', 'SteamOS', 'Controller support is perfect. Plays amazing.', 'Proton Experimental'),
    ('void_walker', 39210, 'Gold', 'Ubuntu', 'Standard launcher works but is clunky.', 'Proton 9.0-3'),
    ('arch_btw', 39210, 'Silver', 'Pop!_OS', 'GShade/ReShade setup is difficult on Linux.', 'Proton 8.0-5'),

    -- No Man's Sky (275850)
    ('deck_player', 275850, 'Platinum', 'SteamOS', 'Runs brilliantly. Crossplay and multiplayer work exactly as on Windows.', 'Proton 9.0-3'),
    ('arch_btw', 275850, 'Platinum', 'Arch', 'Very smooth 60+ fps at high settings.', 'Proton Experimental'),
    ('void_walker', 275850, 'Gold', 'Ubuntu', 'Occasional stutter when entering atmospheres.', 'Proton 9.0-3'),
    ('neon_tux', 275850, 'Gold', 'Fedora', 'Multiplayer works perfectly.', 'Proton 8.0-5'),
    ('deck_player', 275850, 'Silver', 'Debian', 'Requires Vulkan shader caching to be fully built before smooth play.', 'Proton Experimental'),

    -- Dead by Daylight (381210)
    ('void_walker', 381210, 'Platinum', 'Ubuntu', 'EAC is fully supported now. Killer and Survivor both play perfectly.', 'Proton Experimental'),
    ('deck_player', 381210, 'Platinum', 'SteamOS', 'Runs flawlessly on Deck.', 'Proton 9.0-3'),
    ('arch_btw', 381210, 'Platinum', 'Arch', 'Zero issues, immediate matchmaking.', 'Proton 9.0-3'),
    ('neon_tux', 381210, 'Gold', 'Pop!_OS', 'Minor frame drops when playing killer on certain maps.', 'Proton 8.0-5'),
    ('void_walker', 381210, 'Platinum', 'Fedora', 'Flawless performance.', 'Proton Experimental'),

    -- Warframe (230410)
    ('neon_tux', 230410, 'Gold', 'Arch', 'Launcher can be slightly buggy, but the game runs at 144fps no problem.', 'Proton 9.0-3'),
    ('deck_player', 230410, 'Platinum', 'SteamOS', 'Perfect on Deck. Controls map beautifully.', 'Proton Experimental'),
    ('void_walker', 230410, 'Gold', 'Ubuntu', 'Requires GE-Proton for some text rendering in menus.', 'Custom Proton: GE-Proton'),
    ('arch_btw', 230410, 'Silver', 'Debian', 'Occasional network disconnects during railjack missions.', 'Proton 8.0-5'),
    ('neon_tux', 230410, 'Gold', 'Linux Mint', 'Very smooth once in-game. Loading times are fast.', 'Proton 9.0-3'),

    -- Garry's Mod (4000)
    ('arch_btw', 4000, 'Platinum', 'Debian', 'Forcing Proton fixes missing textures on custom servers completely.', 'Proton 9.0-3'),
    ('neon_tux', 4000, 'Gold', 'Arch', 'x86-64 beta branch required for best performance.', 'Proton Experimental'),
    ('deck_player', 4000, 'Gold', 'SteamOS', 'Controls require heavy tweaking for trackpads.', 'Proton 9.0-3'),
    ('void_walker', 4000, 'Silver', 'Ubuntu', 'Voice chat sometimes doesnt route correctly.', 'Proton 8.0-5'),
    ('arch_btw', 4000, 'Platinum', 'Pop!_OS', 'Flawless with Proton 9.', 'Proton 9.0-3'),

    -- Stray (1332010)
    ('deck_player', 1332010, 'Platinum', 'SteamOS', 'Stuttering was fixed in a recent Proton update. Smooth experience.', 'Proton Experimental'),
    ('arch_btw', 1332010, 'Platinum', 'Arch', 'Flawless experience.', 'Proton 9.0-3'),
    ('void_walker', 1332010, 'Gold', 'Ubuntu', 'Smooth, minor stutter on loading new zones.', 'Proton 9.0-3'),
    ('neon_tux', 1332010, 'Gold', 'Fedora', 'Runs great out of the box.', 'Proton 8.0-5'),
    ('deck_player', 1332010, 'Platinum', 'Debian', 'Perfect performance and visuals.', 'Proton Experimental'),

    -- DayZ (221100)
    ('void_walker', 221100, 'Gold', 'Ubuntu', 'BattlEye works for official servers now. Community launchers require extra setup.', 'Proton 9.0-3'),
    ('arch_btw', 221100, 'Silver', 'Arch', 'DZSA Launcher requires workarounds to run through Proton.', 'Proton Experimental'),
    ('deck_player', 221100, 'Gold', 'SteamOS', 'Playable but UI is small.', 'Proton 9.0-3'),
    ('neon_tux', 221100, 'Bronze', 'Fedora', 'Frequent kicks due to BattlEye timeouts.', 'Proton 8.0-5'),
    ('void_walker', 221100, 'Gold', 'Pop!_OS', 'Official servers run perfectly without issues.', 'Proton Experimental'),

    -- Civilization VI (289070)
    ('neon_tux', 289070, 'Platinum', 'Arch', 'Force Proton for crossplay with Windows. Works perfect.', 'Proton Experimental'),
    ('deck_player', 289070, 'Gold', 'SteamOS', 'Controls are okay, touch screen works well.', 'Proton 9.0-3'),
    ('void_walker', 289070, 'Platinum', 'Ubuntu', 'Runs flawlessly via Proton Experimental.', 'Proton Experimental'),
    ('arch_btw', 289070, 'Gold', 'Debian', 'Late game turns take slightly longer to process.', 'Proton 8.0-5'),
    ('neon_tux', 289070, 'Silver', 'Fedora', 'Occasional crashes during leader animations.', 'Proton 9.0-3'),

    -- Extra Reports for V1 Games by New Users
    ('arch_btw', 1086940, 'Platinum', 'Debian', 'No issues at all during a full 100-hour playthrough.', 'Proton 9.0-3'),
    ('deck_player', 271590, 'Silver', 'SteamOS', 'Rockstar Launcher updates frequently break the game on Deck. Requires manual prefixes often.', 'Proton Experimental'),
    ('void_walker', 1145360, 'Platinum', 'Ubuntu', 'Perfect out of the box.', 'Proton 9.0-3'),
    ('neon_tux', 413150, 'Platinum', 'Arch', 'Flawless with mods.', 'Custom Proton: GE-Proton')

) AS r(u, app_id, t, d, c, p)
JOIN users u ON u.username = r.u
JOIN games g ON g.steam_appid = r.app_id;
