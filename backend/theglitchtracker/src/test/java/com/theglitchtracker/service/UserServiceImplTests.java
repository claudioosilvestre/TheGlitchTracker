package com.theglitchtracker.service;

import com.theglitchtracker.model.User;
import com.theglitchtracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplTests {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserServiceImpl userService;


    @Test
    public void listAllUsers_shouldReturnListOfAllUsers() {

        User user = new User();
        user.setId(1);
        user.setName("test");

        List<User> userList = new ArrayList<>();
        userList.add(user);

        when(userRepository.findAll()).thenReturn(userList);

        List<User> result = userService.listAllUsers();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test", result.get(0).getName());
    }

    @Test
    public void createUser_shouldReturnUserCreated() {

        User user = new User();
        user.setId(1);
        user.setName("test");

        when(userRepository.findByName("test")).thenReturn(Optional.empty());
        when(userRepository.save(user)).thenReturn(user);

        User result = userService.createUser(user);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getName());

    }
}
