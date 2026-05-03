package com.theglitchtracker.service;

import com.theglitchtracker.model.User;

import java.util.List;

public interface UserService {

    public List<User> listAllUsers();

    public User createUser(User user);

    public User updateUser(int userId, User user);

    public User findById(int userId);

    public void deleteUser(int userId);

}
