package com.theglitchtracker.service;

import com.theglitchtracker.persistence.RagVectorStoreService;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AiServiceImpl implements AiService {

    @Value("${ai.rag_prompt_template}")
    private Resource ragPromptTemplate;

    private ChatClient chatClient;
    private RagVectorStoreService vectorStore;

    public AiServiceImpl(ChatClient chatClient, RagVectorStoreService vectorStore) {
        this.chatClient = chatClient;
        this.vectorStore = vectorStore;
    }

    @Override
    public Generation info(String question) {
        List<String> contentList = vectorStore.search(question);

        PromptTemplate promptTemplate = new PromptTemplate(ragPromptTemplate);
        Prompt prompt = promptTemplate.create(Map.of(
                "input", question,
                "documents", String.join("\n", contentList)));

        return chatClient.prompt(prompt).call().chatResponse().getResult();
    }

    @Override
    public String generateOracleQuote() {
        return chatClient.prompt()
                .user("You are the Oracle from the Matrix. Generate a short, cryptic, philosophical quote " +
                        "as if spoken by the Oracle herself — wise, mysterious, and slightly unsettling. " +
                        "It should hint at glitches, anomalies, or hidden truths in the system. " +
                        "Every time you respond, the quote must be different and surprising. " +
                        "Draw inspiration from different themes each time: fate, choice, time, code, reality, or deception. " +
                        "Maximum 15 words. Return only the quote, no quotation marks, no explanation.")
                .call()
                .content();
    }
}