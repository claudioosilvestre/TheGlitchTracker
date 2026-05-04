package com.theglitchtracker.factorie;

import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.FactoryBean;

/**
 * A {@link org.springframework.beans.factory.FactoryBean} implementation for creating
 * configured instances of {@link OpenAiChatModel}.
 * This factory enables Spring-based construction of {@code OpenAiChatModel}
 * objects by injecting the required {@link OpenAiApi} instance and optional
 * {@link OpenAiChatOptions} that define default chat behavior.
 */
public class OpenAiChatModelFactory implements FactoryBean<OpenAiChatModel> {

    private OpenAiApi openAiApi;
    private OpenAiChatOptions openAiChatOptions;

    /**
     * Creates and returns a fully initialized {@link OpenAiChatModel} using the
     * configured {@link OpenAiApi} and {@link OpenAiChatOptions}.
     *
     * @return a new {@code OpenAiChatModel} instance
     */
    @Override
    public OpenAiChatModel getObject() {
        return OpenAiChatModel
                .builder()
                .openAiApi(openAiApi)
                .defaultOptions(openAiChatOptions)
                .build();
    }

    /**
     * Returns the type of object created by this factory.
     *
     * @return the {@code OpenAiChatModel} class
     */
    @Override
    public Class<?> getObjectType() {
        return OpenAiChatModel.class;
    }

    /**
     * Sets the {@link OpenAiApi} instance to be used by created chat models.
     *
     * @param openAiApi the API client for OpenAI
     */
    public void setOpenAiApi(OpenAiApi openAiApi) {
        this.openAiApi = openAiApi;
    }

    /**
     * Sets the default chat options that will be applied to constructed
     * {@link OpenAiChatModel} instances.
     *
     * @param openAiChatOptions the default chat configuration
     */
    public void setOpenAiChatOptions(OpenAiChatOptions openAiChatOptions) {
        this.openAiChatOptions = openAiChatOptions;
    }
}