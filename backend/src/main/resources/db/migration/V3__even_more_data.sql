-- Insert Additional Users
INSERT INTO users (username, email, password) VALUES
('tux_fan', 'tux@ucll.be', crypt('password123', gen_salt('bf'))),
('proton_tester', 'proton@ucll.be', crypt('password123', gen_salt('bf'))),
('linux_gamer', 'linux@ucll.be', crypt('password123', gen_salt('bf'))),
('ubuntu_user', 'ubuntu@ucll.be', crypt('password123', gen_salt('bf'))),
('fedora_hat', 'fedora@ucll.be', crypt('password123', gen_salt('bf'))),
('minty_fresh', 'mint@ucll.be', crypt('password123', gen_salt('bf'))),
('pop_os_stan', 'popos@ucll.be', crypt('password123', gen_salt('bf'))),
('gentoo_compiler', 'gentoo@ucll.be', crypt('password123', gen_salt('bf'))),
('kde_lover', 'kde@ucll.be', crypt('password123', gen_salt('bf'))),
('gnome_fan', 'gnome@ucll.be', crypt('password123', gen_salt('bf')));

-- Insert Large Batch of Reports
INSERT INTO reports (user_id, game_id, tier, distribution, comment, proton_version)
SELECT u.id, g.id, r.t, r.d, r.c, r.p
FROM (VALUES
    -- The Witcher 3: Wild Hunt (292030)
    ('tux_fan'::varchar, 292030::int, 'Platinum'::varchar, 'Arch'::varchar, 'Runs flawlessly with the next-gen update. Ray tracing works but heavily impacts FPS.'::varchar, 'Proton Experimental'::varchar),
    ('linux_gamer', 292030, 'Gold', 'Ubuntu', 'DirectX 12 mode occasionally stutters. DX11 is a perfectly smooth 60fps.', 'Proton 9.0-3'),
    ('fedora_hat', 292030, 'Platinum', 'Fedora', 'Zero issues detected over a 50 hour playthrough.', 'Proton 9.0-3'),
    ('minty_fresh', 292030, 'Gold', 'Linux Mint', 'Launcher needs to be bypassed for a better experience using --launcher-skip.', 'Proton 8.0-5'),

    -- Red Dead Redemption 2 (1174180)
    ('pop_os_stan', 1174180, 'Gold', 'Pop!_OS', 'Rockstar Launcher updates break the game occasionally. When it runs, it runs perfectly.', 'Proton Experimental'),
    ('gentoo_compiler', 1174180, 'Gold', 'Gentoo', 'Requires Vulkan shaders to compile fully, otherwise massive stutter in towns.', 'Proton 9.0-3'),
    ('ubuntu_user', 1174180, 'Silver', 'Ubuntu', 'Random crashes every few hours indicating out of memory errors, despite having 32GB.', 'Proton 8.0-5'),
    ('tux_fan', 1174180, 'Gold', 'Arch', 'FSR 2.0 implementation works great on Linux. Solid performance.', 'Proton Experimental'),

    -- God of War (1593500)
    ('proton_tester', 1593500, 'Platinum', 'Debian', 'Sony ports are fantastic. Runs natively out of the box with zero tweaks.', 'Proton 9.0-3'),
    ('kde_lover', 1593500, 'Platinum', 'Arch', 'Incredible performance. Controller support is completely flawless.', 'Proton Experimental'),
    ('gnome_fan', 1593500, 'Gold', 'Fedora', 'Minor memory leak observed after 4+ hours of continuous play. Restarting fixes it.', 'Proton 9.0-3'),

    -- God of War Ragnarök (2322010)
    ('tux_fan', 2322010, 'Gold', 'Arch', 'Requires PSN account bypass mod to play offline, but gameplay is smooth.', 'Proton Experimental'),
    ('linux_gamer', 2322010, 'Silver', 'Ubuntu', 'VRAM intensive. Requires at least 8GB VRAM to not crash during realm travel.', 'Proton 9.0-3'),
    ('fedora_hat', 2322010, 'Gold', 'Fedora', 'Great frame pacing, but cutscene audio de-syncs if framerate drops below 30.', 'Proton Experimental'),

    -- Red Dead Redemption (2668510)
    ('minty_fresh', 2668510, 'Platinum', 'Linux Mint', 'Older engine scales beautifully. 144fps without breaking a sweat.', 'Proton 9.0-3'),
    ('pop_os_stan', 2668510, 'Platinum', 'Pop!_OS', 'Flawless execution. No Rockstar Launcher issues on this one yet.', 'Proton 9.0-3'),

    -- Alan Wake (108710)
    ('gentoo_compiler', 108710, 'Platinum', 'Gentoo', 'Old DX9 title, Proton translates it perfectly through DXVK.', 'Proton 8.0-5'),
    ('ubuntu_user', 108710, 'Platinum', 'Ubuntu', 'Stable 60fps, no crashes, controller works natively.', 'Proton 9.0-3'),

    -- Death Stranding (1190460)
    ('kde_lover', 1190460, 'Gold', 'Arch', 'DLSS requires PROTON_ENABLE_NVAPI=1. Otherwise perfect.', 'Proton Experimental'),
    ('gnome_fan', 1190460, 'Platinum', 'Fedora', 'Decima engine performs incredibly well on Linux.', 'Proton 9.0-3'),
    ('tux_fan', 1190460, 'Gold', 'Arch', 'Some cutscenes have very minor stutter, gameplay is fluid.', 'Proton 9.0-3'),

    -- Death Stranding Director's Cut (1850570)
    ('proton_tester', 1850570, 'Platinum', 'Debian', 'Upgraded version runs just as well as the base game.', 'Proton 9.0-3'),
    ('linux_gamer', 1850570, 'Platinum', 'Ubuntu', 'Ultrawide support works flawlessly out of the box.', 'Proton Experimental'),

    -- Grand Theft Auto: Vice City (12110) & San Andreas (12120)
    ('fedora_hat', 12110, 'Gold', 'Fedora', 'Needs a frame limiter (SilentPatch) or physics break.', 'Proton 7.0-6'),
    ('minty_fresh', 12120, 'Gold', 'Linux Mint', 'Downgrade patch highly recommended for modding, runs great after.', 'Proton 8.0-5'),
    ('pop_os_stan', 12120, 'Platinum', 'Pop!_OS', 'Vanilla Steam version runs fine out of the box with Proton.', 'Proton 9.0-3'),

    -- Hunt: Showdown 1896 (594650)
    ('gentoo_compiler', 594650, 'Gold', 'Gentoo', 'EAC is fully functional. Engine upgrade increased system requirements though.', 'Proton Experimental'),
    ('ubuntu_user', 594650, 'Gold', 'Ubuntu', 'Smooth gameplay, minor shadow flickering on AMD GPUs.', 'Proton 9.0-3'),
    ('kde_lover', 594650, 'Silver', 'Arch', 'Game crashes occasionally on extract. EAC works fine otherwise.', 'Proton 9.0-3'),

    -- INSIDE (304430)
    ('gnome_fan', 304430, 'Platinum', 'Fedora', 'Perfectly smooth, played start to finish without a single hitch.', 'Proton 9.0-3'),
    ('tux_fan', 304430, 'Platinum', 'Arch', 'Looks and runs beautifully.', 'Proton 8.0-5'),

    -- Control Ultimate Edition (870780)
    ('proton_tester', 870780, 'Gold', 'Debian', 'Use DX11 executable if DX12 crashes. DXVK handles it perfectly.', 'Proton 9.0-3'),
    ('linux_gamer', 870780, 'Platinum', 'Ubuntu', 'Ray tracing works great with PROTON_ENABLE_NVAPI=1 on Nvidia cards.', 'Proton Experimental'),
    ('fedora_hat', 870780, 'Gold', 'Fedora', 'Very solid frame pacing, but loading screens take slightly longer.', 'Proton 9.0-3'),

    -- The Last of Us Part I (1888930)
    ('minty_fresh', 1888930, 'Silver', 'Linux Mint', 'Initial shader compilation takes over 40 minutes. Runs okay afterwards.', 'Proton Experimental'),
    ('pop_os_stan', 1888930, 'Gold', 'Pop!_OS', 'Much better after recent patches. Needs 16GB RAM minimum to not stutter.', 'Proton 9.0-3'),
    ('gentoo_compiler', 1888930, 'Silver', 'Gentoo', 'High CPU utilization causes thermal throttling on laptops.', 'Proton 9.0-3'),
    ('ubuntu_user', 1888930, 'Gold', 'Ubuntu', 'Solid 60fps on medium settings. Mouse camera movement feels slightly floaty.', 'Proton Experimental'),

    -- The Last of Us Part II Remastered (2531310)
    ('kde_lover', 2531310, 'Platinum', 'Arch', 'Port is significantly better optimized than Part I. Flawless execution.', 'Proton Experimental'),
    ('gnome_fan', 2531310, 'Gold', 'Fedora', 'Minor texture pop-in during fast horse riding segments.', 'Proton 9.0-3'),

    -- BioShock Series (7670, 8850, 8870)
    ('tux_fan', 7670, 'Platinum', 'Arch', 'Classic game translates perfectly. 144fps lock.', 'Proton 8.0-5'),
    ('linux_gamer', 8850, 'Gold', 'Ubuntu', '2K launcher is annoying, use launch options to bypass it.', 'Proton 9.0-3'),
    ('proton_tester', 8870, 'Platinum', 'Debian', 'Bypass the launcher and it runs absolutely flawlessly.', 'Proton 9.0-3'),

    -- The Binding of Isaac: Rebirth (250900)
    ('fedora_hat', 250900, 'Platinum', 'Fedora', 'Thousands of hours on Linux, never crashed once.', 'Proton 9.0-3'),
    ('minty_fresh', 250900, 'Platinum', 'Linux Mint', 'Mods from the workshop load and work perfectly.', 'Proton 9.0-3'),

    -- Hades II (1145350)
    ('pop_os_stan', 1145350, 'Platinum', 'Pop!_OS', 'Supergiant never misses. Perfect performance in early access.', 'Proton Experimental'),
    ('gentoo_compiler', 1145350, 'Platinum', 'Gentoo', 'Rock solid 120fps. Controller mapping is instant.', 'Proton 9.0-3'),
    ('ubuntu_user', 1145350, 'Gold', 'Ubuntu', 'Minor stutter when entering a new biome for the first time.', 'Proton 9.0-3'),

    -- Grand Theft Auto V (271590)
    ('kde_lover', 271590, 'Gold', 'Arch', 'Story mode is perfect. Online loads infinitely sometimes.', 'Proton 9.0-3'),
    ('gnome_fan', 271590, 'Silver', 'Fedora', 'Rockstar Launcher broke again recently. Had to use Proton GE to fix.', 'Custom Proton: GE-Proton'),
    ('tux_fan', 271590, 'Gold', 'Arch', 'FiveM works but requires significant manual tweaking.', 'Proton Experimental'),

    -- Grand Theft Auto IV (12210)
    ('linux_gamer', 12210, 'Gold', 'Ubuntu', 'Requires DXVK to fix the terrible native PC port performance. Runs great after.', 'Proton 9.0-3'),
    ('proton_tester', 12210, 'Silver', 'Debian', 'Final mission helicopter bug is tied to framerate. Lock to 30fps to pass it.', 'Proton 8.0-5'),

    -- Stardew Valley (413150)
    ('fedora_hat', 413150, 'Platinum', 'Fedora', 'Flawless execution. SMAPI modding works natively without Proton if using the Linux build.', 'Proton 9.0-3'),
    ('minty_fresh', 413150, 'Platinum', 'Linux Mint', 'Perfect. Multiplayer works perfectly.', 'Proton 9.0-3'),
    ('pop_os_stan', 413150, 'Platinum', 'Pop!_OS', 'Mods heavily impact load times, but gameplay remains completely smooth.', 'Proton Experimental'),

    -- Baldur's Gate 3 (1086940)
    ('gentoo_compiler', 1086940, 'Platinum', 'Gentoo', 'Vulkan backend works beautifully. Act 3 CPU bottleneck exists just like on Windows.', 'Proton 9.0-3'),
    ('ubuntu_user', 1086940, 'Gold', 'Ubuntu', 'Launcher sometimes hangs. Use --skip-launcher in launch options.', 'Proton Experimental'),
    ('kde_lover', 1086940, 'Platinum', 'Arch', 'Over 200 hours played entirely on Linux without a single crash.', 'Proton 9.0-3'),

    -- Baldur's Gate (228280)
    ('gnome_fan', 228280, 'Platinum', 'Fedora', 'Enhanced Edition runs natively via Proton without any visual glitches.', 'Proton 8.0-5'),

    -- Hollow Knight (367520)
    ('tux_fan', 367520, 'Platinum', 'Arch', 'Pixel perfect input timing. Completely flawless.', 'Proton 9.0-3'),
    ('linux_gamer', 367520, 'Platinum', 'Ubuntu', 'Native port is worse than running Windows version through Proton.', 'Proton 9.0-3'),

    -- BORKED / ANTI-CHEAT GAMES (Strict enforcement)

    -- Rainbow Six Siege (359550)
    ('proton_tester', 359550, 'Borked', 'Debian', 'BattlEye kicks you before you even drop in. Unplayable.', 'Proton Experimental'),
    ('fedora_hat', 359550, 'Borked', 'Fedora', 'Ubisoft refuses to enable Proton support for BattlEye. Do not buy for Linux.', 'Proton 9.0-3'),
    ('minty_fresh', 359550, 'Borked', 'Linux Mint', 'Kicked from every match. Only training grounds work.', 'Proton 8.0-5'),

    -- Destiny 2 (1085660)
    ('pop_os_stan', 1085660, 'Borked', 'Pop!_OS', 'Bungie will actively ban your account if you try to bypass their block on Linux.', 'Proton 9.0-3'),
    ('gentoo_compiler', 1085660, 'Borked', 'Gentoo', 'Game fails to launch entirely. Blocked at the engine level.', 'Proton Experimental'),
    ('ubuntu_user', 1085660, 'Borked', 'Ubuntu', 'Strictly unplayable due to developer hostility towards Proton.', 'Proton 9.0-3'),

    -- PUBG (578080)
    ('kde_lover', 578080, 'Borked', 'Arch', 'Anti-cheat explicitly blocks Linux clients. You cannot join a match.', 'Proton 9.0-3'),
    ('gnome_fan', 578080, 'Borked', 'Fedora', 'Game launches but matchmaking is disabled for Proton users.', 'Proton Experimental'),
    ('tux_fan', 578080, 'Borked', 'Arch', 'Do not waste your time. BattlEye implementation blocks Linux.', 'Proton 8.0-5'),

    -- Call of Duty (1938090)
    ('linux_gamer', 1938090, 'Borked', 'Ubuntu', 'Ricochet anti-cheat crashes the game on startup. Unplayable.', 'Proton 9.0-3'),
    ('proton_tester', 1938090, 'Borked', 'Debian', 'Zero chance of getting past the anti-cheat initialization.', 'Proton Experimental'),
    ('fedora_hat', 1938090, 'Borked', 'Fedora', 'Crashes to desktop immediately. Ricochet blocks Proton.', 'Proton 9.0-3'),

    -- EA SPORTS FC 26 (3405690)
    ('minty_fresh', 3405690, 'Borked', 'Linux Mint', 'EA Anticheat makes this a brick on Linux.', 'Proton 9.0-3'),
    ('pop_os_stan', 3405690, 'Borked', 'Pop!_OS', 'Do not buy if you use Linux. EA Anticheat blocks it completely.', 'Proton Experimental'),
    ('gentoo_compiler', 3405690, 'Borked', 'Gentoo', 'Fails to launch. Anti-cheat splash screen loops infinitely.', 'Proton 9.0-3'),

    -- Rust (252490)
    ('ubuntu_user', 252490, 'Borked', 'Ubuntu', 'Facepunch enabled EAC for Linux, but it only works on servers that explicitly disable encryption. 99% of servers block you.', 'Proton 9.0-3'),
    ('kde_lover', 252490, 'Bronze', 'Arch', 'You can play on community servers with EAC turned off, but official servers kick you instantly.', 'Proton Experimental'),
    ('gnome_fan', 252490, 'Borked', 'Fedora', 'Effectively unplayable unless you host your own server without EAC.', 'Proton 9.0-3')

) AS r(u, app_id, t, d, c, p)
JOIN users u ON u.username = r.u
JOIN games g ON g.steam_appid = r.app_id;
