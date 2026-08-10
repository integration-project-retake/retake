CREATE TABLE game_genres (
                             game_id BIGINT NOT NULL,
                             genre VARCHAR(100) NOT NULL,

                             CONSTRAINT fk_game_genres_game
                                 FOREIGN KEY (game_id)
                                     REFERENCES games (id)
                                     ON DELETE CASCADE,

                             CONSTRAINT pk_game_genres
                                 PRIMARY KEY (game_id, genre)
);

CREATE INDEX idx_game_genres_genre
    ON game_genres (LOWER(genre));


-- Dota 2
INSERT INTO game_genres (game_id, genre)
SELECT id, 'MOBA'
FROM games
WHERE steam_appid = 570;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Strategy'
FROM games
WHERE steam_appid = 570;


-- Grand Theft Auto V
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 271590;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Open World'
FROM games
WHERE steam_appid = 271590;


-- Grand Theft Auto IV
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 12210;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Open World'
FROM games
WHERE steam_appid = 12210;


-- Grand Theft Auto III
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 12100;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Open World'
FROM games
WHERE steam_appid = 12100;


-- Hades
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 1145360;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Roguelike'
FROM games
WHERE steam_appid = 1145360;


-- Hades II
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 1361510;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Roguelike'
FROM games
WHERE steam_appid = 1361510;


-- Hollow Knight
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Action'
FROM games
WHERE steam_appid = 367520;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Metroidvania'
FROM games
WHERE steam_appid = 367520;


-- Stardew Valley
INSERT INTO game_genres (game_id, genre)
SELECT id, 'Simulation'
FROM games
WHERE steam_appid = 413150;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Farming'
FROM games
WHERE steam_appid = 413150;


-- Baldur's Gate 3
INSERT INTO game_genres (game_id, genre)
SELECT id, 'RPG'
FROM games
WHERE steam_appid = 1086940;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Turn-Based'
FROM games
WHERE steam_appid = 1086940;


-- Baldur's Gate
INSERT INTO game_genres (game_id, genre)
SELECT id, 'RPG'
FROM games
WHERE steam_appid = 228280;

INSERT INTO game_genres (game_id, genre)
SELECT id, 'Turn-Based'
FROM games
WHERE steam_appid = 228280;