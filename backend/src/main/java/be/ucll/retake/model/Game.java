package be.ucll.retake.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "games")
public class Game {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; 


    @Column(name = "steam_appid", unique = true, nullable = false)
    @NotNull(message = "Steam appid is required")
    private Integer steamAppid;

    @Column(nullable = false)
    @NotNull(message = "Name is required")
    private String name;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Game() {}

    public Game(Integer steamAppid, String name) {
        setSteamAppid(steamAppid);
        setName(name);
    }
    public Long getId() {return id;}

    public String getName() {return name;}
    public void setName(String name) {this.name = name;}

    public Integer getSteamAppid() {return steamAppid;}
    public void setSteamAppid(Integer steamAppid) {this.steamAppid = steamAppid;}
    
    public Instant getCreatedAt() { return createdAt; }
}
