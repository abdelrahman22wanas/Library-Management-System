package com.example.library.backend.bootstrap;

import com.example.library.backend.model.BookEntity;
import com.example.library.backend.model.LoanEntity;
import com.example.library.backend.model.UserEntity;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.LoanRepository;
import com.example.library.backend.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataMigrator implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataMigrator.class);
    private static final Path DATA_DIR = Path.of("data");

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;
    private final ObjectMapper mapper;

    public DataMigrator(BookRepository bookRepository, UserRepository userRepository,
                        LoanRepository loanRepository) {
        this.bookRepository = bookRepository;
        this.userRepository = userRepository;
        this.loanRepository = loanRepository;
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    @Override
    public void run(String... args) {
        if (bookRepository.count() > 0) {
            log.info("Database already contains data, skipping migration");
            return;
        }
        log.info("Database is empty, attempting to migrate from legacy JSON files...");
        migrateBooks();
        migrateUsers();
        migrateLoans();
        log.info("Data migration completed");
    }

    private void migrateBooks() {
        Path file = DATA_DIR.resolve("books.json");
        if (!Files.exists(file)) {
            log.warn("books.json not found at {}, skipping", file.toAbsolutePath());
            return;
        }
        try (InputStream is = Files.newInputStream(file)) {
            List<BookEntity> books = mapper.readValue(is, new TypeReference<List<BookEntity>>() {});
            bookRepository.saveAll(books);
            log.info("Migrated {} books", books.size());
        } catch (IOException e) {
            log.error("Failed to migrate books", e);
        }
    }

    private void migrateUsers() {
        Path file = DATA_DIR.resolve("users.json");
        if (!Files.exists(file)) {
            log.warn("users.json not found at {}, skipping", file.toAbsolutePath());
            return;
        }
        try (InputStream is = Files.newInputStream(file)) {
            List<UserEntity> users = mapper.readValue(is, new TypeReference<List<UserEntity>>() {});
            userRepository.saveAll(users);
            log.info("Migrated {} users", users.size());
        } catch (IOException e) {
            log.error("Failed to migrate users", e);
        }
    }

    private void migrateLoans() {
        Path file = DATA_DIR.resolve("loans.json");
        if (!Files.exists(file)) {
            log.warn("loans.json not found at {}, skipping", file.toAbsolutePath());
            return;
        }
        try (InputStream is = Files.newInputStream(file)) {
            List<LoanEntity> loans = mapper.readValue(is, new TypeReference<List<LoanEntity>>() {});
            loanRepository.saveAll(loans);
            log.info("Migrated {} loans", loans.size());
        } catch (IOException e) {
            log.error("Failed to migrate loans", e);
        }
    }
}
