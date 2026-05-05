package com.theglitchtracker.persistence;

import jakarta.annotation.PostConstruct;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.tika.TikaDocumentReader;
import org.springframework.ai.transformer.splitter.TextSplitter;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.ai.vectorstore.SearchRequest;
import org.springframework.ai.vectorstore.SimpleVectorStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

import java.io.File;
import java.util.List;


/**
 * A component responsible for managing and interacting with a vector store.
 * The {@code VectorStore} is responsible for initializing the vector store, loading or creating it,
 * and performing similarity searches on documents. It uses Tika to read documents and splits them
 * into smaller parts for efficient search and retrieval.
 */
@Component
public class VectorStore {


    @Value("${ai.vector_store_file}")
    private String storeFilePath;

    @Value("${ai.rag_documents}:")
    private List<Resource> ragResources;

    @Value("${ai.rag_number_results}")
    private int numberResults;

    private SimpleVectorStore vectorStore;

    /**
     * Initializes the vector store by either loading it from disk or creating a new one from the provided resources.
     * If the vector store file already exists, it is loaded. Otherwise, the specified document resources are
     * processed, split into smaller documents, added to the store, and saved to disk for future use.
     */

    @PostConstruct
    public void init() {
        File storeFile = new File(storeFilePath);

        if (storeFile.exists()) {
            System.out.println("Found vector store, loading...");
            vectorStore.load(storeFile);
        } else {
            if (ragResources != null && !ragResources.isEmpty()) {
                ragResources.forEach(resource -> {
                    System.out.println("Found document: " + resource.getFilename());

                    TikaDocumentReader documentReader = new TikaDocumentReader(resource);
                    List<Document> docs = documentReader.get();

                    TextSplitter textSplitter = new TokenTextSplitter();
                    List<Document> splitDocs = textSplitter.apply(docs);

                    vectorStore.add(splitDocs);
                });

                vectorStore.save(storeFile);
            }
        }
    }

    /**
     * Performs a similarity search on the vector store using the provided search parameter.
     * This method performs a search query and returns a list of document contents that are most similar
     * to the search parameter, based on the underlying vector store's capabilities.
     *
     * @param searchParam the query parameter used to search the vector store.
     * @return a list of the most relevant document contents.
     */
    public List<String> search(String searchParam) {
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(searchParam)
                        .topK(numberResults)
                        .build());

        return documents.stream().map(Document::getText).toList();
    }

    /**
     * Sets the {@link SimpleVectorStore}
     * @param vectorStore to set
     */
    @Autowired
    public void setSimpleVectorStore(SimpleVectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
}