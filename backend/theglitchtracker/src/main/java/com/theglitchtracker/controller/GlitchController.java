package com.theglitchtracker.controller;

import com.theglitchtracker.model.Glitch;
import com.theglitchtracker.service.GlitchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.theglitchtracker.dtos.GlitchUserDTO;

import java.util.List;

@RestController
@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping("/api/glitches")
public class GlitchController {

    private GlitchService glitchService;

    @GetMapping
    public ResponseEntity<List<Glitch>> getAll() {

        return ResponseEntity.ok(glitchService.listAllGlitches());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Glitch> getGlitchById(@PathVariable int id) {

        Glitch glitch = glitchService.getGlitchById(id);

        return ResponseEntity.ok(glitch);
    }

    @PostMapping
    public ResponseEntity<Glitch> create(@RequestBody Glitch glitch) {

        Glitch newGlitch = glitchService.createGlitch(glitch);

        return ResponseEntity.status(HttpStatus.CREATED).body(newGlitch);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Glitch> updateGlitch(@PathVariable int id, @RequestBody Glitch glitch) {

        Glitch updatedGlitch = glitchService.updateGlitch(id, glitch);

        return ResponseEntity.ok(updatedGlitch);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Glitch> updateStatus(@PathVariable int id, @RequestBody Glitch glitch) {

        Glitch updatedGlitch = glitchService.updateStatus(id, glitch.getGlitchStatus());

        return ResponseEntity.ok(updatedGlitch);
    }

    @PutMapping("/{id}/priority")
    public ResponseEntity<Glitch> updatePriority(@PathVariable int id, @RequestBody Glitch glitch) {

        Glitch updatedGlitch = glitchService.updateGlitchPriority(id, glitch.getGlitchPriority());

        return ResponseEntity.ok(updatedGlitch);
    }

    @PatchMapping("/{id}/users")
    public ResponseEntity<Glitch> addUserToGlitch(@PathVariable int id, @RequestBody GlitchUserDTO glitchUserDTO) {


        Glitch updatedGlitch = glitchService.addUserToGlitch(id, glitchUserDTO.getUserId());

        return ResponseEntity.ok(updatedGlitch);
    }

    @DeleteMapping("/{id}/users/{userId}")
    public ResponseEntity<Glitch> removeUserFromGlitch(@PathVariable int id, @PathVariable int userId) {

        Glitch updatedGlitch = glitchService.removeUserFromGlitch(id, userId);

        return ResponseEntity.ok(updatedGlitch);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGlitch(@PathVariable int id) {

        glitchService.deleteGlitch(id);

        return ResponseEntity.noContent().build();
    }


    @Autowired
    public void setGlitchService(GlitchService glitchService) {
        this.glitchService = glitchService;
    }
}
