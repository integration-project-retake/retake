package be.ucll.retake.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.retake.model.Game;

public interface GameRepository extends JpaRepository<Game, Long>{
    
    
}
