package be.ucll.retake.model;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
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

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "game_aliases",
            joinColumns = @JoinColumn(name = "game_id")
    )
    @Column(name = "alias", nullable = false)
    private Set<String> aliases = new LinkedHashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Game() {
    }

    public Game(Integer steamAppid, String name) {
        setSteamAppid(steamAppid);
        setName(name);
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getSteamAppid() {
        return steamAppid;
    }

    public void setSteamAppid(Integer steamAppid) {
        this.steamAppid = steamAppid;
    }

    public Set<String> getAliases() {
        return aliases;
    }

    public void setAliases(Set<String> aliases) {
        this.aliases = aliases != null
                ? new LinkedHashSet<>(aliases)
                : new LinkedHashSet<>();
    }

    public void addAlias(String alias) {
        if (alias != null && !alias.isBlank()) {
            aliases.add(alias.trim());
        }
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}