package com.theglitchtracker.service;

import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.model.GlitchPriority;
import com.theglitchtracker.model.GlitchStatus;

import java.util.List;
import java.util.Map;

public interface GlitchService {

    List<Glitch> listAllGlitches();

    Glitch getGlitchById(int glitchId);

    Glitch createGlitch(Glitch glitch);

    Glitch updateGlitch(int glitchId, Glitch glitch);

    Glitch updateStatus(int glitchId, GlitchStatus glitchStatus);

    Glitch updateGlitchPriority(int glitchId, GlitchPriority glitchPriority);

    Glitch addUserToGlitch(int glitchId, int userId);

    Map<GlitchPriority, Long> glitchSummary();

    Glitch removeUserFromGlitch(int glitchId, int userId);

    void deleteGlitch(int glitchId);

    Glitch resolveGlitch(int glitchId);
}

