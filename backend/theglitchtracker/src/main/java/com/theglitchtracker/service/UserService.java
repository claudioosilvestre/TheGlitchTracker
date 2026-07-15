package com.theglitchtracker.service;

import com.theglitchtracker.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    String uploadAvatar(MultipartFile file);

    List<User> listAllUsers();

    User createUser(User user);

    User updateUser(int userId, User user);

    User findById(int userId);

    void deleteUser(int userId);
}
