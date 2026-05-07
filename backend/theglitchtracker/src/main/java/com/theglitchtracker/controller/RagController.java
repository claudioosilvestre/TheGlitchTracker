package com.theglitchtracker.controller;

import com.theglitchtracker.service.RagService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rag")
public class RagController {

    private final RagService ragService;

    public RagController(RagService ragService) {
        this.ragService = ragService;
    }

    @GetMapping
    public String ask(@RequestParam String q) {
        return ragService.ask(q);
    }
}