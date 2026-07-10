package com.theglitchtracker.service;

import com.theglitchtracker.exception.UserAlreadyExistsException;
import com.theglitchtracker.exception.UserNotFoundException;
import com.theglitchtracker.model.User;
import com.theglitchtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository;


    @Override
    public String uploadAvatar(MultipartFile file) {

        String contentType = file.getContentType();

        if (
                contentType == null ||
                        (!contentType.equals("image/png") &&
                                !contentType.equals("image/jpeg"))
        ) {
            throw new RuntimeException("Only PNG and JPG images are allowed");
        }

        String originalFilename = file.getOriginalFilename();

        if (originalFilename == null || originalFilename.isBlank()) {
            throw new RuntimeException("Invalid file name");
        }

        String filename = UUID.randomUUID() + "_" + originalFilename;

        try {
            Path uploadPath = Paths
                    .get("uploads", "avatars")
                    .toAbsolutePath()
                    .normalize();

            Files.createDirectories(uploadPath);

            Path destinationFile = uploadPath
                    .resolve(filename)
                    .normalize();

            file.transferTo(destinationFile.toFile());

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload avatar image: " + e.getMessage(), e);
        }

        return "/uploads/avatars/" + filename;
    }

    @Override
    public List<User> listAllUsers() {

        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) {
        if (user == null) {
            throw new IllegalArgumentException("User can not be null");
        } else if (user.getName() == null) {
            throw new IllegalArgumentException("User name can not be null");
        } else if (user.getName().isBlank()) {
            throw new IllegalArgumentException("User name can not be empty");
        }

        if (userRepository.findByName(user.getName()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        User newUser = userRepository.save(user);

        return newUser;
    }

    @Override
    public User updateUser(int userId, User user) {
        if(userId <= 0) {
            throw new IllegalArgumentException("User id can not be negative");
        }
        if(user == null) {
            throw new IllegalArgumentException("User can not be null");
        }
        if(!userRepository.findById(userId).isPresent()) {
            throw new UserNotFoundException();
        }

        User updatedUser = userRepository.findById(userId).get();

        if(!updatedUser.getName().equals(user.getName()) &&
                userRepository.findByName(user.getName()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        updatedUser.setName(user.getName());
        updatedUser.setUserRole(user.getUserRole());
        updatedUser.setProfileUrl(user.getProfileUrl());

        userRepository.save(updatedUser);

        return updatedUser;
    }

    @Override
    public User findById(int userId) {
        if(userId <= 0) {
            throw new IllegalArgumentException("Id must be positive");
        }

        if(!userRepository.findById(userId).isPresent()) {
            throw new UserNotFoundException();
        }

        User user = userRepository.findById(userId).get();

        return user;
    }

    @Override
    public void deleteUser(int userId) {
        if(userId <= 0) {
            throw new IllegalArgumentException("Id must be positive");
        }
        if(!userRepository.findById(userId).isPresent()) {
            throw new UserNotFoundException();
        }
        userRepository.deleteById(userId);
    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
