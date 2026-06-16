package com.example.library.desktopclient.client;

import com.example.library.common.dto.BookDTO;
import com.example.library.common.dto.LoanDTO;
import com.example.library.common.dto.UserDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class LibraryApiClient {

    private final String baseUrl;
    private final HttpClient httpClient;
    private final ObjectMapper mapper;

    public LibraryApiClient(String baseUrl) {
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.httpClient = HttpClient.newHttpClient();
        this.mapper = new ObjectMapper();
        this.mapper.registerModule(new JavaTimeModule());
        this.mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    public List<BookDTO> getBooks() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/books"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), new TypeReference<List<BookDTO>>() {});
    }

    public BookDTO addBook(String title, String author, int copies)
            throws IOException, InterruptedException {
        String params = String.format("title=%s&author=%s&copies=%d",
                encode(title), encode(author), copies);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/books?" + params))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), BookDTO.class);
    }

    public List<UserDTO> getUsers() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/users"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), new TypeReference<List<UserDTO>>() {});
    }

    public UserDTO addUser(String name, String email) throws IOException, InterruptedException {
        String params = String.format("name=%s&email=%s", encode(name), encode(email));
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/users?" + params))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), UserDTO.class);
    }

    public List<LoanDTO> getLoans() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/loans"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), new TypeReference<List<LoanDTO>>() {});
    }

    public List<LoanDTO> getActiveLoans() throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/loans/active"))
                .GET()
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), new TypeReference<List<LoanDTO>>() {});
    }

    public LoanDTO borrowBook(UUID userId, UUID bookId, int loanDays)
            throws IOException, InterruptedException {
        String params = String.format("userId=%s&bookId=%s&loanDays=%d",
                userId, bookId, loanDays);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/loans/borrow?" + params))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), LoanDTO.class);
    }

    public LoanDTO returnBook(UUID loanId, LocalDate returnDate)
            throws IOException, InterruptedException {
        String params = String.format("loanId=%s&returnDate=%s", loanId, returnDate);
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/loans/return?" + params))
                .POST(HttpRequest.BodyPublishers.noBody())
                .build();
        HttpResponse<String> response = httpClient.send(request,
                HttpResponse.BodyHandlers.ofString());
        return mapper.readValue(response.body(), LoanDTO.class);
    }

    private static String encode(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }
}
