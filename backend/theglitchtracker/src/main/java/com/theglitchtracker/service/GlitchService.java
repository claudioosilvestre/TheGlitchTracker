package com.theglitchtracker.service;

import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.model.GlitchPriority;
import com.theglitchtracker.model.GlitchStatus;

import java.util.List;

public interface GlitchService {

    public List<Glitch> listAllGlitches();

    public Glitch getGlitchById(int glitchId);

    public Glitch createGlitch(Glitch glitch);

    public Glitch updateGlitch(int glitchId, Glitch glitch);

    public Glitch updateStatus(int glitchId, GlitchStatus glitchStatus);

    public Glitch updateGlitchPriority(int glitchId, GlitchPriority glitchPriority);

    public Glitch addUserToGlitch(int glitchId, int userId);

    public Glitch removeUserFromGlitch(int glitchId, int userId);

    public void deleteGlitch(int glitchId);
}

