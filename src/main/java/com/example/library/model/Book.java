package com.example.library.model;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSetter;
import java.util.Objects;
import java.util.UUID;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Book {
    private UUID id;
    private String title;
    private String author;
    private int totalCopies;
    @JsonAlias("available")
    private int availableCopies;

    public Book() {
    }

    public Book(UUID id, String title, String author, int totalCopies, int availableCopies) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.totalCopies = totalCopies;
        this.availableCopies = availableCopies;
    }

    public static Book create(String title, String author, int copies) {
        int safeCopies = Math.max(1, copies);
        return new Book(UUID.randomUUID(), title, author, safeCopies, safeCopies);
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public int getTotalCopies() {
        return totalCopies;
    }

    public void setTotalCopies(int totalCopies) {
        this.totalCopies = totalCopies;
    }

    public int getAvailableCopies() {
        return availableCopies;
    }

    public void setAvailableCopies(int availableCopies) {
        this.availableCopies = availableCopies;
    }

    @JsonSetter("available")
    public void setAvailableFromBoolean(boolean available) {
        this.availableCopies = available ? Math.max(this.availableCopies, 1) : 0;
    }

    public boolean isAvailable() {
        return availableCopies > 0;
    }

    public void decrementAvailable() {
        if (availableCopies <= 0) {
            throw new IllegalStateException("No copies available");
        }
        availableCopies -= 1;
    }

    public void incrementAvailable() {
        if (availableCopies < totalCopies) {
            availableCopies += 1;
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Book book)) return false;
        return Objects.equals(id, book.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
