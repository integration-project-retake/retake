package be.ucll.retake.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.mockito.Mockito.when;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import be.ucll.retake.model.Game;
import be.ucll.retake.repository.GameRepository;
import be.ucll.retake.repository.ReportRepository;

@ExtendWith(MockitoExtension.class)
public class GameServiceTest {

    @Mock
    private GameRepository gameRepository;

    @Mock
    private ReportRepository reportRepository;

    private GameService gameService;

    @BeforeEach
    void setup() {
        gameService = new GameService(
                gameRepository,
                reportRepository
        );
    }

    @Test
    void givenGamesWithSharedGenres_whenGettingRelatedGames_thenOrderByMostSharedGenres() {
        Game selectedGame = createGame(
                1L,
                100,
                "Selected Game",
                "Action",
                "Adventure",
                "RPG"
        );

        Game threeMatches = createGame(
                2L,
                101,
                "Three Matches",
                "Action",
                "Adventure",
                "RPG"
        );

        Game twoMatches = createGame(
                3L,
                102,
                "Two Matches",
                "Action",
                "Adventure"
        );

        Game oneMatch = createGame(
                4L,
                103,
                "One Match",
                "RPG"
        );

        when(gameRepository.findById(1L))
                .thenReturn(java.util.Optional.of(selectedGame));

        when(gameRepository.findAll())
                .thenReturn(
                        List.of(
                                selectedGame,
                                oneMatch,
                                twoMatches,
                                threeMatches
                        )
                );

        List<Game> result =
                gameService.getRelatedGames(1L);

        assertEquals(3, result.size());

        assertEquals(
                "Three Matches",
                result.get(0).getName()
        );

        assertEquals(
                "Two Matches",
                result.get(1).getName()
        );

        assertEquals(
                "One Match",
                result.get(2).getName()
        );
    }

    @Test
    void givenSelectedGame_whenGettingRelatedGames_thenSelectedGameIsExcluded() {
        Game selectedGame = createGame(
                1L,
                100,
                "Selected Game",
                "Action"
        );

        Game relatedGame = createGame(
                2L,
                101,
                "Related Game",
                "Action"
        );

        when(gameRepository.findById(1L))
                .thenReturn(java.util.Optional.of(selectedGame));

        when(gameRepository.findAll())
                .thenReturn(
                        List.of(
                                selectedGame,
                                relatedGame
                        )
                );

        List<Game> result =
                gameService.getRelatedGames(1L);

        assertEquals(1, result.size());

        assertFalse(
                result.stream()
                        .anyMatch(
                                game ->
                                        game.getId().equals(1L)
                        )
        );
    }

    @Test
    void givenGameWithoutSharedGenre_whenGettingRelatedGames_thenGameIsExcluded() {
        Game selectedGame = createGame(
                1L,
                100,
                "Selected Game",
                "Action",
                "Adventure"
        );

        Game relatedGame = createGame(
                2L,
                101,
                "Related Game",
                "Action"
        );

        Game unrelatedGame = createGame(
                3L,
                102,
                "Unrelated Game",
                "Simulation"
        );

        when(gameRepository.findById(1L))
                .thenReturn(java.util.Optional.of(selectedGame));

        when(gameRepository.findAll())
                .thenReturn(
                        List.of(
                                selectedGame,
                                relatedGame,
                                unrelatedGame
                        )
                );

        List<Game> result =
                gameService.getRelatedGames(1L);

        assertEquals(1, result.size());

        assertEquals(
                "Related Game",
                result.get(0).getName()
        );
    }

    @Test
    void givenMoreThanSixRelatedGames_whenGettingRelatedGames_thenReturnMaximumSix() {
        Game selectedGame = createGame(
                1L,
                100,
                "Selected Game",
                "Action"
        );

        Game game1 = createGame(
                2L,
                101,
                "Game 1",
                "Action"
        );

        Game game2 = createGame(
                3L,
                102,
                "Game 2",
                "Action"
        );

        Game game3 = createGame(
                4L,
                103,
                "Game 3",
                "Action"
        );

        Game game4 = createGame(
                5L,
                104,
                "Game 4",
                "Action"
        );

        Game game5 = createGame(
                6L,
                105,
                "Game 5",
                "Action"
        );

        Game game6 = createGame(
                7L,
                106,
                "Game 6",
                "Action"
        );

        Game game7 = createGame(
                8L,
                107,
                "Game 7",
                "Action"
        );

        Game game8 = createGame(
                9L,
                108,
                "Game 8",
                "Action"
        );

        when(gameRepository.findById(1L))
                .thenReturn(java.util.Optional.of(selectedGame));

        when(gameRepository.findAll())
                .thenReturn(
                        List.of(
                                selectedGame,
                                game1,
                                game2,
                                game3,
                                game4,
                                game5,
                                game6,
                                game7,
                                game8
                        )
                );

        List<Game> result =
                gameService.getRelatedGames(1L);

        assertEquals(6, result.size());
    }

    @Test
    void givenGameWithoutGenres_whenGettingRelatedGames_thenReturnEmptyList() {
        Game selectedGame =
                createGame(
                        1L,
                        100,
                        "Selected Game"
                );

        when(gameRepository.findById(1L))
                .thenReturn(java.util.Optional.of(selectedGame));

        List<Game> result =
                gameService.getRelatedGames(1L);

        assertEquals(0, result.size());
    }

    private Game createGame(
            Long id,
            Integer steamAppid,
            String name,
            String... genres
    ) {
        Game game =
                new Game(
                        steamAppid,
                        name
                );

        for (String genre : genres) {
            game.addGenre(genre);
        }

        setGameId(game, id);

        return game;
    }

    private void setGameId(
            Game game,
            Long id
    ) {
        try {
            Field idField =
                    Game.class.getDeclaredField("id");

            idField.setAccessible(true);

            idField.set(
                    game,
                    id
            );
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(
                    "Failed to set game id for test",
                    e
            );
        }
    }
}