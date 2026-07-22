CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    username   VARCHAR(30)  NOT NULL UNIQUE,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE games (
    id          BIGSERIAL PRIMARY KEY,
    steam_appid INTEGER      NOT NULL UNIQUE,
    name        VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE reports (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    game_id BIGINT NOT NULL REFERENCES games (id) ON DELETE CASCADE,
    tier VARCHAR(20) NOT NULL,
    distribution VARCHAR(25) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_games_name ON games (name);