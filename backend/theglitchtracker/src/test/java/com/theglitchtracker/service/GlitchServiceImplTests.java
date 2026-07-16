package com.theglitchtracker.service;

import com.theglitchtracker.exception.TheGlitchTrackerException;
import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.model.GlitchPriority;
import com.theglitchtracker.model.GlitchStatus;
import com.theglitchtracker.model.User;
import com.theglitchtracker.repository.GlitchRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class GlitchServiceImplTests {

    @Mock
    private GlitchRepository glitchRepository;

    @Mock
    private UserServiceImpl userService;

    @InjectMocks
    private GlitchServiceImpl glitchService;

    @Test
    void listAllGlitches_shouldReturnListOfAllGlitches() {
        Glitch glitch = new Glitch();
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);

        List<Glitch> glitchList = new ArrayList<>();
        glitchList.add(glitch);

        when(glitchRepository.findAll()).thenReturn(glitchList);

        List<Glitch> result = glitchService.listAllGlitches();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("test", result.get(0).getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.get(0).getGlitchStatus());
        verify(glitchRepository).findAll();
    }

    @Test
    void getGlitchById_shouldReturnGlitch() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.SYSTEM_FIXED);

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));

        Glitch result = glitchService.getGlitchById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.SYSTEM_FIXED, result.getGlitchStatus());
        verify(glitchRepository).findById(1);
    }

    @Test
    void getGlitchById_shouldThrowExceptionIfIdIsNegative() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.getGlitchById(-1)
        );

        assertEquals("Glitch id must be positive", exception.getMessage());
    }

    @Test
    void getGlitchById_shouldThrowExceptionIfGlitchNotFound() {

        when(glitchRepository.findById(5)).thenReturn(Optional.empty());

        TheGlitchTrackerException exception = assertThrows(
                TheGlitchTrackerException.class,
                () -> glitchService.getGlitchById(5)
        );
        assertEquals("Glitch does not exist", exception.getMessage());
    }

    @Test
    void createGlitch_shouldCreateValidGlitch() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);
        glitch.setGlitchPriority(GlitchPriority.GLITCH);

        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.createGlitch(glitch);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.getGlitchStatus());
        assertEquals(GlitchPriority.GLITCH, result.getGlitchPriority());
        verify(glitchRepository).save(glitch);
    }

    @Test
    void createGlitch_shouldThrowExceptionIfGlitchIsNull() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.createGlitch(null)
        );
        assertEquals("Glitch can not be null", exception.getMessage());
    }

    @Test
    void createGlitch_shouldThrowExceptionIfGlitchDoesNotHaveTitle() {

        Glitch glitch = new Glitch();

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.createGlitch(glitch)
        );
        assertEquals("Glitch title can not be empty", exception.getMessage());
    }

    @Test
    void createGlitch_ifGlitchHasNoDefinedGlitchStatusShouldBeDefinedAutomaticallyStatusIdentified () {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchPriority(GlitchPriority.GLITCH);

        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.createGlitch(glitch);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.getGlitchStatus());
        assertEquals(GlitchPriority.GLITCH, result.getGlitchPriority());
        verify(glitchRepository).save(glitch);
    }

    @Test
    void createGlitch_ifGlitchHasNoDefinedGlitchPriorityShouldBeDefinedAutomaticallyPriorityGlitch() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);

        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.createGlitch(glitch);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.getGlitchStatus());
        assertEquals(GlitchPriority.GLITCH, result.getGlitchPriority());
        verify(glitchRepository).save(glitch);
    }

    @Test
    void updateGlitch_withNegativeIdShouldThrowException() {

        Glitch glitch = new Glitch();

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.updateGlitch(-1, glitch)
        );
        assertEquals("Glitch id must be positive", exception.getMessage());
    }

    @Test
    void updateGlitch_withNullGlitchShouldThrowException() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.updateGlitch(1, null)
        );
        assertEquals("Glitch can not be null", exception.getMessage());
    }

    @Test
    void updateGlitch_shouldReturnGlitchUpdated() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);
        glitch.setGlitchPriority(GlitchPriority.GLITCH);

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));

        Glitch updatedGlitch = new Glitch();
        updatedGlitch.setTitle("updatedTest");
        updatedGlitch.setGlitchPriority(GlitchPriority.DEJA_VU);
        updatedGlitch.setGlitchStatus(GlitchStatus.SYSTEM_FIXED);

        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.updateGlitch(1, updatedGlitch);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("updatedTest", result.getTitle());
        assertEquals(GlitchPriority.DEJA_VU, result.getGlitchPriority());
        assertEquals(GlitchStatus.SYSTEM_FIXED, result.getGlitchStatus());
        verify(glitchRepository).findById(1);
        verify(glitchRepository).save(glitch);
    }

    @Test
    void updateGlitch_shouldThrowExceptionIfGlitchNotFound() {

        Glitch glitch = new Glitch();

        when(glitchRepository.findById(5)).thenReturn(Optional.empty());

        TheGlitchTrackerException exception = assertThrows(
                TheGlitchTrackerException.class,
                () -> glitchService.updateGlitch(5, glitch)
        );
        assertEquals("Glitch does not exist", exception.getMessage());
    }

    @Test
    void updateStatus_shouldReturnGlitchWithUpdatedStatus() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);
        glitch.setGlitchPriority(GlitchPriority.DEJA_VU);

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));

        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.updateStatus(1, GlitchStatus.BENDING_THE_RULES);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.BENDING_THE_RULES, result.getGlitchStatus());
        assertEquals(GlitchPriority.DEJA_VU, result.getGlitchPriority());
        verify(glitchRepository).findById(1);
        verify(glitchRepository).save(glitch);
    }

    @Test
    void updateStatus_shouldThrowExceptionIfGlitchIdIsNegative() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.updateStatus(-1, GlitchStatus.BENDING_THE_RULES)
        );
        assertEquals("Glitch id must be positive", exception.getMessage());
    }

    @Test
    void updateStatus_shouldThrowExceptionIfGlitchStatusIsNull() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.updateStatus(1, null)
        );
        assertEquals("Glitch status can not be null", exception.getMessage());
    }

    @Test
    void updateStatus_shouldThrowExceptionIfGlitchNotFound() {

        when(glitchRepository.findById(5)).thenReturn(Optional.empty());

        TheGlitchTrackerException exception = assertThrows(
                TheGlitchTrackerException.class,
                () -> glitchService.updateStatus(5, GlitchStatus.BENDING_THE_RULES)
        );
        assertEquals("Glitch does not exist", exception.getMessage());
    }

    @Test
    void updateStatus_shouldSetResolvedAtNowIfSystemIsFixed() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.BENDING_THE_RULES);

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));
        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.updateStatus(1, GlitchStatus.SYSTEM_FIXED);

        assertNotNull(result);
        assertNotNull(glitch.getResolvedAt());
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.SYSTEM_FIXED, result.getGlitchStatus());
        verify(glitchRepository).findById(1);
        verify(glitchRepository).save(glitch);
    }

    @Test
    void updateStatus_shouldSetResolvedAtNullIfTheSystemIsNotFixed() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.SYSTEM_FIXED);
        glitch.setResolvedAt(LocalDateTime.now());

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));
        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.updateStatus(1, GlitchStatus.IDENTIFIED);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.getGlitchStatus());
        assertNull(result.getResolvedAt());
        verify(glitchRepository).findById(1);
        verify(glitchRepository).save(glitch);
    }

    @Test
    void addUserToGlitch_shouldReturnGlitchWithUser() {

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);

        User user = new User();
        user.setId(2);
        user.setName("nameTest");

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));
        when(userService.findById(2)).thenReturn(user);
        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.addUserToGlitch(1, 2);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertEquals(GlitchStatus.IDENTIFIED, result.getGlitchStatus());
        assertEquals(2, result.getUser().getId());
        assertEquals("nameTest", result.getUser().getName());
        verify(glitchRepository).findById(1);
        verify(userService).findById(2);
        verify(glitchRepository).save(glitch);
    }

    @Test
    void addUserToGlitch_throwExceptionIfGlitchIdIsNegative() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.addUserToGlitch(-1, 1)
        );
        assertEquals("Glitch Id must be positive", exception.getMessage());
    }

    @Test
    void addUserToGlitch_throwExceptionIfUserIdIsNegative() {

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> glitchService.addUserToGlitch(1, -1)
        );
        assertEquals("User Id must be positive", exception.getMessage());
    }

    @Test
    void addUserToGlitch_throwExceptionIfGlitchNotFound() {

        User user = new User();
        user.setId(2);

        when(glitchRepository.findById(1)).thenReturn(Optional.empty());

        TheGlitchTrackerException exception = assertThrows(
                TheGlitchTrackerException.class,
                () -> glitchService.addUserToGlitch(1, 2)
        );
        assertEquals("Glitch does not exist", exception.getMessage());
    }

    @Test
    void removeUserFromGlitch_shouldReturnGlitchWithoutUser() {

        User user = new User();
        user.setId(2);

        Glitch glitch = new Glitch();
        glitch.setId(1);
        glitch.setTitle("test");
        glitch.setUser(user);

        when(glitchRepository.findById(1)).thenReturn(Optional.of(glitch));
        when(glitchRepository.save(glitch)).thenReturn(glitch);

        Glitch result = glitchService.removeUserFromGlitch(1, 2);

        assertNotNull(result);
        assertEquals(1, result.getId());
        assertEquals("test", result.getTitle());
        assertNull(result.getUser());
        verify(glitchRepository).findById(1);
        verify(glitchRepository).save(glitch);
    }
}
