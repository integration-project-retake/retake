package be.ucll.retake.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import be.ucll.retake.model.User;

public interface UserRepository extends JpaRepository<User, Long>{

}
