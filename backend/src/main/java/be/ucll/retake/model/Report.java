package be.ucll.retake.model;

import java.time.Instant;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "reports")
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;
// one user cannot submit duplicate reports for the same game.

    @ManyToOne(optional = false)
    @JoinColumn(name = "game_id")
    private Game game;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Tier tier;

    @Column(nullable = false)
    private String distribution; //like Ubuntu, Fedora, Arch, SteamOS, Debian

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    protected Report() {};
    public Report(User user, Game game, Tier tier, String distribution) {
        this.user = user;
        this.game = game;
        this.tier = tier;
        this.distribution = distribution;
    };

    public Long getId() { return id; }

    public User getUser() { return user; }

    public Game getGame() { return game; }

    public Tier getTier() { return tier; }
    public void setTier(Tier tier) { this.tier = tier; }

    public String getDistro() { return distribution; }
    public void setDistro(String distribution) { this.distribution = distribution; }

    public Instant getCreatedAt() { return createdAt; }
}
