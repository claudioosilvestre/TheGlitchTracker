package com.theglitchtracker.model;

import jakarta.persistence.*;

@Entity
public class Glitch {

    @Id
    @GeneratedValue
    private int id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private GlitchStatus glitchStatus;

    @Enumerated(EnumType.STRING)
    private GlitchPriority glitchPriority;

    @ManyToOne
    private User user;


    public Glitch () {

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
