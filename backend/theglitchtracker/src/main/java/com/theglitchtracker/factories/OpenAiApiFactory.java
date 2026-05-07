package com.theglitchtracker.factories;

import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.FactoryBean;

/**
 * A {@link org.springframework.beans.factory.FactoryBean} implementation for creating
 * instances of {@link OpenAiApi}.
 * This factory allows configuration of the API key through Spring dependency
 * injection, enabling the creation of properly initialized {@code OpenAiApi}
 * objects.
 */
public class OpenAiApiFactory implements FactoryBean<OpenAiApi> {

    private String apiKey;

    /**
     * Creates and returns a new {@link OpenAiApi} instance configured with the
     * provided API key.
     *
     * @return a fully constructed {@code OpenAiApi} instance
     */
    @Override
    public OpenAiApi getObject() {
        return OpenAiApi.builder().apiKey(apiKey).build();
    }

    /**
     * Returns the type of object that this factory produces.
     *
     * @return the {@code OpenAiApi} class
     */
    @Override
    public Class<?> getObjectType() {
        return OpenAiApi.class;
    }

    /**
     * Sets the API key used to construct {@link OpenAiApi} instances.
     *
     * @param apiKey the OpenAI API key to use
     */
    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }
}
