package com.theglitchtracker.service;

import com.theglitchtracker.exception.TheGlitchTrackerException;
import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.model.GlitchPriority;
import com.theglitchtracker.model.GlitchStatus;
import com.theglitchtracker.repository.GlitchRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GlitchServiceImpl implements GlitchService {

    private GlitchRepository glitchRepository;

    @Override
    public List<Glitch> listAllGlitches() {
        return glitchRepository.findAll();
    }

    @Override
    public Glitch getGlitchById(int glitchId) {
        if (glitchId <= 0) {
            throw new IllegalArgumentException("Glitch id must be positive");
        }

        return glitchRepository.findById(glitchId)
                .orElseThrow(() -> new TheGlitchTrackerException("Glitch does not exist"));
    }

    @Override
    public Glitch createGlitch(Glitch glitch) {
        if (glitch == null) {
            throw new IllegalArgumentException("Glitch can not be null");
        }

        if (glitch.getTitle() == null || glitch.getTitle().isBlank()) {
            throw new IllegalArgumentException("Glitch title can not be empty");
        }

        if (glitch.getGlitchStatus() == null) {
            glitch.setGlitchStatus(GlitchStatus.IDENTIFIED);
        }

        if (glitch.getGlitchPriority() == null) {
            glitch.setGlitchPriority(GlitchPriority.GLITCH);
        }

        return glitchRepository.save(glitch);
    }

    @Override
    public Glitch updateGlitch(int glitchId, Glitch glitch) {
        if (glitchId <= 0) {
            throw new IllegalArgumentException("Glitch id must be positive");
        }

        if (glitch == null) {
            throw new IllegalArgumentException("Glitch can not be null");
        }

        Glitch updatedGlitch = glitchRepository.findById(glitchId)
                .orElseThrow(() -> new TheGlitchTrackerException("Glitch does not exist"));

        updatedGlitch.setTitle(glitch.getTitle());
        updatedGlitch.setDescription(glitch.getDescription());
        updatedGlitch.setGlitchStatus(glitch.getGlitchStatus());
        updatedGlitch.setGlitchPriority(glitch.getGlitchPriority());
        updatedGlitch.setUser(glitch.getUser());

        return glitchRepository.save(updatedGlitch);
    }

    @Override
    public Glitch updateStatus(int glitchId, GlitchStatus glitchStatus) {
        if (glitchId <= 0) {
            throw new IllegalArgumentException("Glitch id must be positive");
        }

        if (glitchStatus == null) {
            throw new IllegalArgumentException("Glitch status can not be null");
        }

        Glitch glitch = glitchRepository.findById(glitchId)
                .orElseThrow(() -> new TheGlitchTrackerException("Glitch does not exist"));

        glitch.setGlitchStatus(glitchStatus);

        return glitchRepository.save(glitch);
    }

    @Override
    public Glitch updateGlitchPriority(int glitchId, GlitchPriority glitchPriority) {
        if (glitchId <= 0) {
            throw new IllegalArgumentException("Glitch id must be positive");
        }

        if (glitchPriority == null) {
            throw new IllegalArgumentException("Glitch priority can not be null");
        }

        Glitch glitch = glitchRepository.findById(glitchId)
                .orElseThrow(() -> new TheGlitchTrackerException("Glitch does not exist"));

        glitch.setGlitchPriority(glitchPriority);

        return glitchRepository.save(glitch);
    }

    @Override
    public void deleteGlitch(int glitchId) {
        if (glitchId <= 0) {
            throw new IllegalArgumentException("Glitch id must be positive");
        }

        if (!glitchRepository.findById(glitchId).isPresent()) {
            throw new TheGlitchTrackerException("Glitch does not exist");
        }

        glitchRepository.deleteById(glitchId);
    }

    @Autowired
    public void setGlitchRepository(GlitchRepository glitchRepository) {
        this.glitchRepository = glitchRepository;
    }
}