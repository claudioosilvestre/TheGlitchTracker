package com.theglitchtracker.service;

import com.theglitchtracker.exception.TheGlitchTrackerException;
import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.model.GlitchPriority;
import com.theglitchtracker.model.GlitchStatus;
import com.theglitchtracker.repository.GlitchRepository;
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
}
