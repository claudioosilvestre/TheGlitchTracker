package com.theglitchtracker.model;

public enum UserRole {
    CAPTAIN("Project leader"),
    FIRST_MATE("Second in command"),
    OPERATOR("Main Operator, monitors and manages glitches"),
    PROGRAMMER("hacker, developer"),
    ANALYST("Anomaly analyst"),
    OPERATIVE("Field member, task executor"),
    ENGINEER("Responsible for infrastructure and hardware"),
    RECRUIT("Recruiting new members");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
