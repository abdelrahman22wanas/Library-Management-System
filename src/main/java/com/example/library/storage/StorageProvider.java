package com.example.library.storage;

import com.example.library.model.Book;
import com.example.library.model.Loan;
import com.example.library.model.User;
import java.io.IOException;
import java.util.List;

public interface StorageProvider {
    List<Book> loadBooks() throws IOException;

    List<User> loadUsers() throws IOException;

    List<Loan> loadLoans() throws IOException;

    void saveBooks(List<Book> books) throws IOException;

    void saveUsers(List<User> users) throws IOException;

    void saveLoans(List<Loan> loans) throws IOException;
}
