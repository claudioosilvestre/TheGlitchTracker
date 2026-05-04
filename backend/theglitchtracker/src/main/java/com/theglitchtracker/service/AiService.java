package com.theglitchtracker.service;

import org.springframework.ai.chat.model.Generation;

public interface AiService {

    /**
     * Generates an AI response based on the provided question and relevant documents.
     * This method uses a Retrieval-Augmented Generation (RAG) approach to create a context-aware response.
     * It retrieves related documents from the {@code vectorStore} using the input question, constructs
     * a prompt with those documents and the question, and then sends the prompt to the AI chat client for processing.
     * @param question the input question provided by the user.
     * @return a {@link Generation} object containing the AI's response to the input question.
     */
    public Generation info(String question);
}

