package be.ucll.retake.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.retake.model.Game;

public interface GameRepository extends JpaRepository<Game, Long>{
    boolean existsBySteamAppid(Integer steamAppid);
    Optional<Game> findBySteamAppid(Integer steamAppid);
    
}
