package com.theglitchtracker.controller;

import com.theglitchtracker.service.AiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AiController {

    private AiService aiService;

    @GetMapping("/quote")
    public ResponseEntity<String> generatePhraseOracle() {
        return ResponseEntity.ok(aiService.generateOracleQuote());
    }


    @Autowired
    public void setAiService(AiService aiService) {
        this.aiService = aiService;
    }
}
