package be.ucll.retake.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import be.ucll.retake.model.Game;

public interface GameRepository extends JpaRepository<Game, Long> {

    boolean existsBySteamAppid(Integer steamAppid);

    Optional<Game> findBySteamAppid(Integer steamAppid);

    List<Game> findByNameContainingIgnoreCase(String name);

    @Query("""
            SELECT g
            FROM Game g
            WHERE CAST(g.steamAppid AS string) LIKE CONCAT(:prefix, '%')
            """)
    List<Game> findBySteamAppidStartingWith(
            @Param("prefix") String prefix
    );
}