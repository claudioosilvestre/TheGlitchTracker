package com.theglitchtracker.exception;

public class UserAlreadyExistsException extends TheGlitchTrackerException {

    public UserAlreadyExistsException() {
        super("User already exists");
    }
}
