package com.theglitchtracker.repository;

import com.theglitchtracker.model.Glitch;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GlitchRepository extends JpaRepository<Glitch, Integer> {
}
