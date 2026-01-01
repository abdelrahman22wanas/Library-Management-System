package com.example.library.storage;

import com.example.library.model.Book;
import com.example.library.model.Loan;
import com.example.library.model.User;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

public class FileStorageProvider implements StorageProvider {
    private final Path dataDir;
    private final ObjectMapper mapper;

    public FileStorageProvider(Path dataDir) {
        this.dataDir = dataDir;
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    private <T> List<T> readList(Path path, Class<T[]> type) throws IOException {
        if (!Files.exists(path)) {
            return new ArrayList<>();
        }
        T[] data = mapper.readValue(path.toFile(), type);
        List<T> list = new ArrayList<>();
        for (T element : data) {
            list.add(element);
        }
        return list;
    }

    private <T> void writeList(Path path, List<T> items) throws IOException {
        Files.createDirectories(path.getParent());
        mapper.writerWithDefaultPrettyPrinter().writeValue(path.toFile(), items);
    }

    @Override
    public List<Book> loadBooks() throws IOException {
        return readList(dataDir.resolve("books.json"), Book[].class);
    }

    @Override
    public List<User> loadUsers() throws IOException {
        return readList(dataDir.resolve("users.json"), User[].class);
    }

    @Override
    public List<Loan> loadLoans() throws IOException {
        return readList(dataDir.resolve("loans.json"), Loan[].class);
    }

    @Override
    public void saveBooks(List<Book> books) throws IOException {
        writeList(dataDir.resolve("books.json"), books);
    }

    @Override
    public void saveUsers(List<User> users) throws IOException {
        writeList(dataDir.resolve("users.json"), users);
    }

    @Override
    public void saveLoans(List<Loan> loans) throws IOException {
        writeList(dataDir.resolve("loans.json"), loans);
    }
}
