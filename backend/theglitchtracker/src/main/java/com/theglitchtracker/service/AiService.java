package com.theglitchtracker.service;

import org.springframework.ai.chat.model.Generation;

public interface AiService {

    Generation info(String question);

    String generateOracleQuote();
}

