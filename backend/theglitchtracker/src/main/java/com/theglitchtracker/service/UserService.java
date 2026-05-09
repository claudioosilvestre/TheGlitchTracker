package com.theglitchtracker.service;

import com.theglitchtracker.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    String uploadAvatar(MultipartFile file);

    public List<User> listAllUsers();

    public User createUser(User user);


    public User updateUser(int userId, User user);

    public User findById(int userId);

    public void deleteUser(int userId);

}
