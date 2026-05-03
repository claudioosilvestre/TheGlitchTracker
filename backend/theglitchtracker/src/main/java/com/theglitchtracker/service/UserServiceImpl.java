package com.theglitchtracker.service;

import com.theglitchtracker.exception.UserAlreadyExistsException;
import com.theglitchtracker.exception.UserNotFoundException;
import com.theglitchtracker.model.User;
import com.theglitchtracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    UserRepository userRepository;


    @Override
    public List<User> listAllUsers() {

        return userRepository.findAll();
    }

    @Override
    public User createUser(User user) {
        if(user == null) {
            throw new IllegalArgumentException("User can not be null");
        }
        if(userRepository.findByName(user.getName()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        userRepository.save(user);

        return user;
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

        if(userRepository.findByName(user.getName()).isPresent()) {
            throw new UserAlreadyExistsException();
        }
        updatedUser.setName(user.getName());
        updatedUser.setUserRole(user.getUserRole());

        userRepository.save(updatedUser);

        return updatedUser;
    }

    @Override
    public User findById(int userId) {
        if(userId <= 0) {
            throw new IllegalArgumentException("Id must be positive");
        }



        return null;
    }

    @Override
    public void deleteUser(int userId) {

    }

    @Autowired
    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
