package com.theglitchtracker.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "glitches")
public class Glitch {

    @Id
    @GeneratedValue
    private int id;

    private String title;
    private String description;

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime resolvedAt;

    @Enumerated(EnumType.STRING)
    private GlitchStatus glitchStatus;

    @Enumerated(EnumType.STRING)
    private GlitchPriority glitchPriority;

    // EAGER garante que o User é carregado automaticamente com o Glitch numa única query.
    // Evitamos que o campo "user" venha null quando o frontend pede a lista de glitches (tavamos a ter bug aqui)
    @ManyToOne(fetch = FetchType.EAGER) // -> adicionei o FetchType.EAGER
    @JoinColumn(name = "user_id")

    private User user;

    public Glitch() {
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public GlitchStatus getGlitchStatus() {
        return glitchStatus;
    }

    public void setGlitchStatus(GlitchStatus glitchStatus) {
        this.glitchStatus = glitchStatus;
    }

    public GlitchPriority getGlitchPriority() {
        return glitchPriority;
    }

    public void setGlitchPriority(GlitchPriority glitchPriority) {
        this.glitchPriority = glitchPriority;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }
}