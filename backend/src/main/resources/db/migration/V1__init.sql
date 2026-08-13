-- SCHEMA DEFINITION
CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(30)  NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    bio        VARCHAR(500),
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
    id          BIGSERIAL PRIMARY KEY,
    steam_appid INTEGER      NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_name ON games (name);

CREATE TABLE reports (
    id             BIGSERIAL PRIMARY KEY,
    user_id        BIGINT       NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id        BIGINT       NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    tier           VARCHAR(20)  NOT NULL,
    distribution   VARCHAR(25)  NOT NULL,
    comment        VARCHAR(2000),
    proton_version VARCHAR(50),
    created_at     TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE game_aliases (
    game_id BIGINT       NOT NULL,
    alias   VARCHAR(100) NOT NULL,
    CONSTRAINT fk_game_aliases_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT pk_game_aliases PRIMARY KEY (game_id, alias)
);

CREATE INDEX idx_game_aliases_alias ON game_aliases (LOWER(alias));

CREATE TABLE game_genres (
    game_id BIGINT       NOT NULL,
    genre   VARCHAR(100) NOT NULL,
    CONSTRAINT fk_game_genres_game FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT pk_game_genres PRIMARY KEY (game_id, genre)
);

CREATE INDEX idx_game_genres_genre ON game_genres (LOWER(genre));


-- DATA SEEDING

-- Users
--
CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO users (username, email, password) VALUES
('annie', 'annie@ucll.be', crypt('password123', gen_salt('bf'))),
('sundae', 'sundae@ucll.be', crypt('password123', gen_salt('bf'))),
('enis', 'enis@ucll.be', crypt('password123', gen_salt('bf')));

-- Games
INSERT INTO games (steam_appid, name) VALUES
(570, 'Dota 2'),
(271590, 'Grand Theft Auto V'),
(12210, 'Grand Theft Auto IV'),
(12100, 'Grand Theft Auto III'),
(1145360, 'Hades'),
(1145350, 'Hades II'),
(367520, 'Hollow Knight'),
(413150, 'Stardew Valley'),
(1086940, 'Baldur''s Gate 3'),
(228280, 'Baldur''s Gate'),
(250900, 'The Binding of Isaac: Rebirth'),
(359550, 'Tom Clancy''s Rainbow Six Siege'),
(1085660, 'Destiny 2'),
(578080, 'PUBG: BATTLEGROUNDS'),
(292030, 'The Witcher 3: Wild Hunt'),
(1174180, 'Red Dead Redemption 2'),
(1593500, 'God of War'),
(2322010, 'God of War Ragnarök'),
(2668510, 'Red Dead Redemption'),
(2378620, 'Anomaly Agent'),
(108710, 'Alan Wake'),
(1190460, 'DEATH STRANDING'),
(3280350, 'DEATH STRANDING 2: ON THE BEACH'),
(1850570, 'DEATH STRANDING DIRECTOR''S CUT'),
(12110, 'Grand Theft Auto: Vice City'),
(12120, 'Grand Theft Auto: San Andreas'),
(594650, 'Hunt: Showdown 1896'),
(1938090, 'Call of Duty'),
(3405690, 'EA SPORTS FC 26'),
(304430, 'INSIDE'),
(870780, 'Control Ultimate Edition'),
(1888930, 'The Last of Us Part I'),
(2531310, 'The Last of Us Part II Remastered'),
(7670, 'BioShock'),
(8850, 'BioShock 2'),
(8870, 'BioShock Infinite');

-- Aliases
INSERT INTO game_aliases (game_id, alias)
SELECT g.id, t.alias
FROM (VALUES
    (570::int, 'Dota'::varchar), (271590, 'GTA V'), (271590, 'GTA 5'), (271590, 'gtav'),
    (12210, 'GTA IV'), (12210, 'GTA 4'), (12210, 'gtaiv'),
    (12100, 'GTA III'), (12100, 'GTA 3'), (12100, 'gtaiii'),
    (1145350, 'Hades 2'), (1086940, 'BG3'), (228280, 'Baldur''s Gate 1'), (228280, 'BG1'),
    (250900, 'The Binding of Isaac'), (250900, 'Binding of Isaac'), (250900, 'Isaac'),
    (359550, 'Rainbow Six Siege'), (359550, 'R6'), (359550, 'R6 Siege'), (1085660, 'Destiny'),
    (578080, 'PUBG'), (578080, 'PlayerUnknown''s Battlegrounds'), (292030, 'The Witcher 3'), (292030, 'Witcher 3'),
    (1174180, 'RDR2'), (1174180, 'Red Dead 2'), (1593500, 'GOW'), (1593500, 'God of War 2018'),
    (2322010, 'God of War Ragnarok'), (2322010, 'GOW Ragnarok'), (2322010, 'GOWR'), (2668510, 'RDR'),
    (2668510, 'Red Dead Redemption 1'), (2668510, 'RDR1'), (2378620, 'Anomally Agent'),
    (1190460, 'Death Stranding'), (3280350, 'Death Stranding 2'), (3280350, 'DS2'),
    (1850570, 'Death Stranding Director''s Cut'), (1850570, 'Death Stranding DC'),
    (12110, 'GTA Vice City'), (12110, 'Vice City'), (12120, 'GTA San Andreas'), (12120, 'GTA SA'), (12120, 'San Andreas'),
    (594650, 'Hunt Showdown'), (594650, 'Hunt'), (1938090, 'Call of Duty Warzone'), (1938090, 'Warzone'), (1938090, 'COD Warzone'),
    (3405690, 'FC 26'), (3405690, 'FIFA 26'), (3405690, 'EA FC 26'), (304430, 'Inside'), (870780, 'Control'),
    (1888930, 'The Last of Us'), (1888930, 'TLOU'), (1888930, 'TLOU 1'), (1888930, 'The Last of Us 1'), (1888930, 'The Last of Us Left Behind'),
    (2531310, 'The Last of Us 2'), (2531310, 'The Last of Us Part II'), (2531310, 'TLOU 2'), (2531310, 'TLOU2'),
    (7670, 'BioShock 1'), (8870, 'BioShock 3')
) AS t(app_id, alias)
JOIN games g ON g.steam_appid = t.app_id;

-- Genres
INSERT INTO game_genres (game_id, genre)
SELECT g.id, t.genre
FROM (VALUES
    (570::int, 'Action'::varchar), (570, 'Strategy'), (570, 'MOBA'),
    (271590, 'Action'), (271590, 'Adventure'), (271590, 'Open World'),
    (12210, 'Action'), (12210, 'Adventure'), (12210, 'Open World'),
    (12100, 'Action'), (12100, 'Adventure'), (12100, 'Open World'),
    (1145360, 'Action'), (1145360, 'Roguelike'), (1145360, 'RPG'),
    (1145350, 'Action'), (1145350, 'Roguelike'), (1145350, 'RPG'),
    (367520, 'Action'), (367520, 'Adventure'), (367520, 'Metroidvania'),
    (413150, 'Simulation'), (413150, 'RPG'),
    (1086940, 'RPG'), (1086940, 'Adventure'), (1086940, 'Strategy'),
    (228280, 'RPG'), (228280, 'Adventure'), (228280, 'Strategy'),
    (250900, 'Action'), (250900, 'Roguelike'), (250900, 'RPG'),
    (359550, 'Action'), (359550, 'Shooter'), (359550, 'Multiplayer'),
    (1085660, 'Action'), (1085660, 'Shooter'), (1085660, 'Multiplayer'), (1085660, 'RPG'),
    (578080, 'Action'), (578080, 'Shooter'), (578080, 'Battle Royale'), (578080, 'Multiplayer'),
    (292030, 'RPG'), (292030, 'Adventure'), (292030, 'Open World'),
    (1174180, 'Action'), (1174180, 'Adventure'), (1174180, 'Open World'),
    (1593500, 'Action'), (1593500, 'Adventure'), (1593500, 'RPG'),
    (2322010, 'Action'), (2322010, 'Adventure'), (2322010, 'RPG'),
    (2668510, 'Action'), (2668510, 'Adventure'), (2668510, 'Open World'),
    (2378620, 'Action'), (2378620, 'Adventure'), (2378620, 'Platformer'),
    (108710, 'Action'), (108710, 'Adventure'), (108710, 'Horror'),
    (1190460, 'Action'), (1190460, 'Adventure'), (1190460, 'Open World'),
    (3280350, 'Action'), (3280350, 'Adventure'), (3280350, 'Open World'),
    (1850570, 'Action'), (1850570, 'Adventure'), (1850570, 'Open World'),
    (12110, 'Action'), (12110, 'Adventure'), (12110, 'Open World'),
    (12120, 'Action'), (12120, 'Adventure'), (12120, 'Open World'),
    (594650, 'Action'), (594650, 'Shooter'), (594650, 'Horror'), (594650, 'Multiplayer'),
    (1938090, 'Action'), (1938090, 'Shooter'), (1938090, 'Battle Royale'), (1938090, 'Multiplayer'),
    (3405690, 'Sports'), (3405690, 'Simulation'),
    (304430, 'Adventure'), (304430, 'Puzzle'), (304430, 'Platformer'),
    (870780, 'Action'), (870780, 'Adventure'), (870780, 'Shooter'),
    (1888930, 'Action'), (1888930, 'Adventure'), (1888930, 'Horror'),
    (2531310, 'Action'), (2531310, 'Adventure'), (2531310, 'Horror'),
    (7670, 'Action'), (7670, 'Shooter'), (7670, 'Horror'),
    (8850, 'Action'), (8850, 'Shooter'), (8850, 'Horror'),
    (8870, 'Action'), (8870, 'Shooter'), (8870, 'Adventure')
) AS t(app_id, genre)
JOIN games g ON g.steam_appid = t.app_id;

-- Reports
INSERT INTO reports (user_id, game_id, tier, distribution, comment, proton_version)
SELECT u.id, g.id, r.t, r.d, r.c, r.p
FROM (VALUES
    ('enis'::varchar, 570::int, 'Gold'::varchar, 'Ubuntu'::varchar, 'Runs great out of the box, minor stutter on load screens.'::varchar, 'Proton 9.0-3'::varchar),
    ('enis', 570, 'Platinum', 'SteamOS', 'Flawless on Steam Deck, no tweaks needed.', 'Proton Experimental'),
    ('enis', 271590, 'Silver', 'Fedora', 'Playable but needs tweaks — occasional crashes in online mode.', 'Proton 8.0-5'),
    ('annie', 271590, 'Gold', 'Ubuntu', 'Story mode runs perfectly. Online is hit or miss.', 'Proton 9.0-3'),
    ('sundae', 12210, 'Bronze', 'Arch', 'Runs, but frequent frame drops and audio crackle. Needs work.', 'Proton 8.0-5'),
    ('enis', 12100, 'Gold', 'Ubuntu', 'Old game, runs great with a community patch.', 'Proton 7.0-6'),
    ('sundae', 1145360, 'Platinum', 'Arch', 'Perfect, runs better than on Windows honestly.', 'Proton 9.0-3'),
    ('annie', 1145360, 'Platinum', 'Ubuntu', 'Zero issues, native-feeling performance.', 'Proton 9.0-3'),
    ('annie', 1145350, 'Gold', 'SteamOS', 'Early access but very smooth on the Deck.', 'Proton Experimental'),
    ('sundae', 367520, 'Platinum', 'Ubuntu', 'Runs flawlessly, one of the best Linux experiences.', 'Proton 9.0-3'),
    ('annie', 413150, 'Gold', 'Ubuntu', 'Very pleasant experience.\n\nI launched the game with Proton because it was the easiest way I found to install the Stardew Valley Very Expanded (SVVE) mod. Everything works perfectly, including multiplayer!', 'Custom Proton: GE-Proton10-34'),
    ('sundae', 413150, 'Platinum', 'SteamOS', 'Perfect on the Steam Deck, no setup needed.', 'Proton 9.0-3'),
    ('enis', 1086940, 'Gold', 'Ubuntu', 'Runs beautifully after the latest Proton update. Long load times on older drives.', 'Proton 9.0-3'),
    ('annie', 1086940, 'Platinum', 'SteamOS', 'Steam Deck verified for a reason — flawless.', 'Proton Experimental'),
    ('sundae', 228280, 'Platinum', 'Arch', 'Classic runs perfectly through the Enhanced Edition.', 'Proton 8.0-5')
) AS r(u, app_id, t, d, c, p)
JOIN users u ON u.username = r.u
JOIN games g ON g.steam_appid = r.app_id;

-- Loop Reports (15 iterations for Annie & Dota 2)
INSERT INTO reports (user_id, game_id, tier, distribution, comment, proton_version)
SELECT u.id, g.id, 'Gold', 'Ubuntu ' || i, 'Test report number ' || i, 'Proton 9.0-3'
FROM users u, games g, generate_series(0, 14) AS i
WHERE u.username = 'annie' AND g.steam_appid = 570;
