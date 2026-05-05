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

@Component
public class RagVectorStoreService {

    @Value("${ai.vector_store_file}")
    private String storeFilePath;

    @Value("${ai.rag_documents:}")
    private List<Resource> ragResources;

    @Value("${ai.rag_number_results}")
    private int numberResults;

    private SimpleVectorStore vectorStore;

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

    public List<String> search(String searchParam) {
        List<Document> documents = vectorStore.similaritySearch(
                SearchRequest.builder()
                        .query(searchParam)
                        .topK(numberResults)
                        .build()
        );

        return documents.stream()
                .map(Document::getText)
                .toList();
    }

    @Autowired
    public void setSimpleVectorStore(SimpleVectorStore vectorStore) {
        this.vectorStore = vectorStore;
    }
}