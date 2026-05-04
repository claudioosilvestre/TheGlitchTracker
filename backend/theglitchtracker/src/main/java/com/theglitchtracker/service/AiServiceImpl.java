package com.theglitchtracker.service;

import com.theglitchtracker.persistence.VectorStore;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.model.Generation;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;



import java.util.List;
import java.util.Map;

/**
 * Implementation of the {@link AiService} interface.
 */
@Service
public class AiServiceImpl implements AiService {

    @Value("${ai.rag_prompt_template}")
    private Resource ragPromptTemplate;

    private ChatClient chatClient;
    private VectorStore vectorStore;


    /**
     * @see AiService#info(String)
     */
    @Override
    public Generation info(String question) {
        List<String> contentList = vectorStore.search(question);

        PromptTemplate promptTemplate = new PromptTemplate(ragPromptTemplate);
        Prompt prompt = promptTemplate.create(Map.of(
                "input", question,
                "documents", String.join("\n", contentList)));

        return chatClient.prompt(prompt).call().chatResponse().getResult();
    }

    /**
     * Set the chat client
     * @param chatClient to chat
     */
    @Autowired
    public void setChatClient(ChatClient chatClient) {
        this.chatClient = chatClient;
    }

    /**
     * Set the vector store
     * @param vectorStore to set
     */
    @Autowired
    public void setStore(VectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
}