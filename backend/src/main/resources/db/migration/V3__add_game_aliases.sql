CREATE TABLE game_aliases (
                              game_id BIGINT NOT NULL,
                              alias VARCHAR(100) NOT NULL,

                              CONSTRAINT fk_game_aliases_game
                                  FOREIGN KEY (game_id)
                                      REFERENCES games (id)
                                      ON DELETE CASCADE,

                              CONSTRAINT pk_game_aliases
                                  PRIMARY KEY (game_id, alias)
);

CREATE INDEX idx_game_aliases_alias
    ON game_aliases (LOWER(alias));


-- Grand Theft Auto
INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta'
FROM games
WHERE steam_appid = 271590;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta v'
FROM games
WHERE steam_appid = 271590;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gtav'
FROM games
WHERE steam_appid = 271590;


INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta'
FROM games
WHERE steam_appid = 12210;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta iv'
FROM games
WHERE steam_appid = 12210;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gtaiv'
FROM games
WHERE steam_appid = 12210;


INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta'
FROM games
WHERE steam_appid = 12100;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gta iii'
FROM games
WHERE steam_appid = 12100;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'gtaiii'
FROM games
WHERE steam_appid = 12100;


-- Other catalog aliases
INSERT INTO game_aliases (game_id, alias)
SELECT id, 'dota'
FROM games
WHERE steam_appid = 570;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'hk'
FROM games
WHERE steam_appid = 367520;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'sdv'
FROM games
WHERE steam_appid = 413150;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'stardew'
FROM games
WHERE steam_appid = 413150;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'bg3'
FROM games
WHERE steam_appid = 1086940;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'bg'
FROM games
WHERE steam_appid = 228280;

INSERT INTO game_aliases (game_id, alias)
SELECT id, 'hades 2'
FROM games
WHERE steam_appid = 1361510;