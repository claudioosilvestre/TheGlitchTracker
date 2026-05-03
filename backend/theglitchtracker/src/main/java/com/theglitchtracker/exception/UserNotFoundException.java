package com.theglitchtracker.exception;

public class UserNotFoundException extends TheGlitchTrackerException{

    public UserNotFoundException() {
        super("User does not exist");
    }
}
