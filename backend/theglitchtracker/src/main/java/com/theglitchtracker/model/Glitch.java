package com.theglitchtracker.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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

    @JsonManagedReference
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
            name = "users_list",
            joinColumns = @JoinColumn(name = "glitch_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> userList = new ArrayList<>();


    public Glitch () {

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

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }
}
