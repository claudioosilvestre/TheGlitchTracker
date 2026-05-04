package com.theglitchtracker.factories;

import org.springframework.ai.openai.OpenAiEmbeddingModel;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.FactoryBean;

/**
 * A {@link org.springframework.beans.factory.FactoryBean} implementation for creating
 * instances of {@link SimpleVectorStore}.
 * This factory enables Spring-based construction of a {@code SimpleVectorStore}
 * by injecting the required {@link OpenAiEmbeddingModel}, which is used to generate
 * vector embeddings for stored content.
 */
public class SimpleVectorStoreFactory implements FactoryBean<SimpleVectorStore> {

    private OpenAiEmbeddingModel embeddingModel;

    /**
     * Creates and returns a fully initialized {@link SimpleVectorStore} configured
     * with the provided embedding model.
     *
     * @return a new {@code SimpleVectorStore} instance
     */
    @Override
    public SimpleVectorStore getObject() {
        return SimpleVectorStore.builder(embeddingModel).build();
    }

    /**
     * Returns the type of object produced by this factory.
     *
     * @return the {@code SimpleVectorStore} class
     */
    @Override
    public Class<?> getObjectType() {
        return SimpleVectorStore.class;
    }

    /**
     * Sets the {@link OpenAiEmbeddingModel} used by the vector store for embedding
     * generation.
     *
     * @param embeddingModel the embedding model to use
     */
    public void setEmbeddingModel(OpenAiEmbeddingModel embeddingModel) {
        this.embeddingModel = embeddingModel;
    }
}