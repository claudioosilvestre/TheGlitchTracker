package com.theglitchtracker.service;

import org.springframework.ai.chat.model.Generation;

public interface AiService {

    public Generation info(String question);

    public String generateOracleQuote();
}

