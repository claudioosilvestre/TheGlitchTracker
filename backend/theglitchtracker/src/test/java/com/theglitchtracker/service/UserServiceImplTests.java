package com.theglitchtracker.service;

import com.theglitchtracker.exception.UserAlreadyExistsException;
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

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

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

    @Test
    public void createUser_shouldThrowExceptionIfUserExists() {

        User user = new User();
        user.setId(1);
        user.setName("test");

        when(userRepository.findByName("test")).thenReturn(Optional.of(user));

        UserAlreadyExistsException exception = assertThrows(
                UserAlreadyExistsException.class, () -> userService.createUser(user));

        verify(userRepository).findByName("test");
        assertEquals("User already exists", exception.getMessage());
    }

    @Test
    public void updateUser_shouldReturnUpdatedUser() {

        User user = new User();
        user.setId(1);
        user.setName("test");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        User updatedUser = new User();
        updatedUser.setId(1);
        updatedUser.setName("test1");

        when(userRepository.findByName("test1")).thenReturn(Optional.empty());
        when(userRepository.save(updatedUser)).thenReturn(updatedUser);

        User result = userService.updateUser(1, updatedUser);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test1", result.getName());
    }

    @Test
    public void deleteUser_shouldDeleteUserFromDatabase() {

        User user = new User();
        user.setId(1);
        user.setName("test");

        when(userRepository.findById(1)).thenReturn(Optional.of(user));

        userService.deleteUser(1);

        verify(userRepository, times(1)).deleteById(1);
    }

}
