package com.example.library.desktopclient.controller;

import com.example.library.common.dto.BookDTO;
import com.example.library.common.dto.LoanDTO;
import com.example.library.common.dto.UserDTO;
import com.example.library.desktopclient.client.LibraryApiClient;
import java.io.IOException;
import java.time.LocalDate;
import java.util.Optional;
import javafx.application.Platform;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.fxml.FXML;
import javafx.scene.control.Alert;
import javafx.scene.control.ComboBox;
import javafx.scene.control.DatePicker;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.util.StringConverter;

public class LibraryController {
    private LibraryApiClient apiClient;

    private final ObservableList<BookDTO> bookItems = FXCollections.observableArrayList();
    private final ObservableList<UserDTO> userItems = FXCollections.observableArrayList();
    private final ObservableList<LoanDTO> loanItems = FXCollections.observableArrayList();

    @FXML private TableView<BookDTO> booksTable;
    @FXML private TableColumn<BookDTO, String> bookTitleColumn;
    @FXML private TableColumn<BookDTO, String> bookAuthorColumn;
    @FXML private TableColumn<BookDTO, Integer> bookAvailableColumn;
    @FXML private TableColumn<BookDTO, Integer> bookTotalColumn;
    @FXML private TextField bookTitleInput;
    @FXML private TextField bookAuthorInput;
    @FXML private TextField bookCopiesInput;

    @FXML private TableView<UserDTO> usersTable;
    @FXML private TableColumn<UserDTO, String> userNameColumn;
    @FXML private TableColumn<UserDTO, String> userEmailColumn;
    @FXML private TextField userNameInput;
    @FXML private TextField userEmailInput;

    @FXML private TableView<LoanDTO> loansTable;
    @FXML private TableColumn<LoanDTO, String> loanBookColumn;
    @FXML private TableColumn<LoanDTO, String> loanUserColumn;
    @FXML private TableColumn<LoanDTO, String> loanBorrowedColumn;
    @FXML private TableColumn<LoanDTO, String> loanDueColumn;
    @FXML private TableColumn<LoanDTO, String> loanReturnedColumn;
    @FXML private TableColumn<LoanDTO, String> loanFineColumn;

    @FXML private ComboBox<UserDTO> userSelect;
    @FXML private ComboBox<BookDTO> bookSelect;
    @FXML private TextField loanDaysInput;

    @FXML private ComboBox<LoanDTO> activeLoanSelect;
    @FXML private DatePicker returnDatePicker;

    public void setApiClient(LibraryApiClient apiClient) {
        this.apiClient = apiClient;
        refreshAll();
    }

    @FXML
    private void initialize() {
        setupBookTable();
        setupUserTable();
        setupLoanTable();
        setupComboBoxes();
    }

    private void setupBookTable() {
        bookTitleColumn.setCellValueFactory(new PropertyValueFactory<>("title"));
        bookAuthorColumn.setCellValueFactory(new PropertyValueFactory<>("author"));
        bookAvailableColumn.setCellValueFactory(new PropertyValueFactory<>("availableCopies"));
        bookTotalColumn.setCellValueFactory(new PropertyValueFactory<>("totalCopies"));
        booksTable.setItems(bookItems);
    }

    private void setupUserTable() {
        userNameColumn.setCellValueFactory(new PropertyValueFactory<>("name"));
        userEmailColumn.setCellValueFactory(new PropertyValueFactory<>("email"));
        usersTable.setItems(userItems);
    }

    private void setupLoanTable() {
        loanBookColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> findBook(data.getValue().getBookId()).map(BookDTO::getTitle).orElse("Unknown"))));
        loanUserColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> findUser(data.getValue().getUserId()).map(UserDTO::getName).orElse("Unknown"))));
        loanBorrowedColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> data.getValue().getBorrowedDate().toString())));
        loanDueColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> data.getValue().getDueDate().toString())));
        loanReturnedColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> Optional.ofNullable(data.getValue().getReturnedDate())
                                        .map(LocalDate::toString).orElse("-"))));
        loanFineColumn.setCellValueFactory(data ->
                javafx.beans.property.SimpleStringProperty.stringExpression(
                        javafx.beans.binding.Bindings.createStringBinding(
                                () -> Optional.ofNullable(data.getValue().getFineAccrued())
                                        .map(Object::toString).orElse("0.00"))));
        loansTable.setItems(loanItems);
    }

    private void setupComboBoxes() {
        userSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(UserDTO user) {
                return user == null ? "" : user.getName();
            }

            @Override
            public UserDTO fromString(String s) {
                return null;
            }
        });
        bookSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(BookDTO book) {
                return book == null ? "" : book.getTitle();
            }

            @Override
            public BookDTO fromString(String s) {
                return null;
            }
        });
        activeLoanSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(LoanDTO loan) {
                if (loan == null) return "";
                BookDTO book = findBook(loan.getBookId()).orElse(null);
                UserDTO user = findUser(loan.getUserId()).orElse(null);
                return (user != null ? user.getName() : "?") + " - "
                        + (book != null ? book.getTitle() : "?");
            }

            @Override
            public LoanDTO fromString(String s) {
                return null;
            }
        });
    }

    @FXML
    private void handleAddBook() {
        String title = bookTitleInput.getText();
        String author = bookAuthorInput.getText();
        int copies = parseIntOrDefault(bookCopiesInput.getText(), 1);
        if (isBlank(title) || isBlank(author)) {
            showError("Title and author are required.");
            return;
        }
        try {
            BookDTO book = apiClient.addBook(title.trim(), author.trim(), copies);
            bookItems.add(book);
            clearBookInputs();
            refreshAll();
        } catch (Exception ex) {
            showError("Failed to add book: " + ex.getMessage());
        }
    }

    @FXML
    private void handleAddUser() {
        String name = userNameInput.getText();
        String email = userEmailInput.getText();
        if (isBlank(name) || isBlank(email)) {
            showError("Name and email are required.");
            return;
        }
        try {
            UserDTO user = apiClient.addUser(name.trim(), email.trim());
            userItems.add(user);
            clearUserInputs();
            refreshAll();
        } catch (Exception ex) {
            showError("Failed to add user: " + ex.getMessage());
        }
    }

    @FXML
    private void handleBorrow() {
        UserDTO user = userSelect.getValue();
        BookDTO book = bookSelect.getValue();
        if (user == null || book == null) {
            showError("Select a user and a book.");
            return;
        }
        int days = parseIntOrDefault(loanDaysInput.getText(), 14);
        try {
            apiClient.borrowBook(user.getId(), book.getId(), days);
            refreshAll();
            loanDaysInput.clear();
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleReturn() {
        LoanDTO loan = activeLoanSelect.getValue();
        if (loan == null) {
            showError("Select a loan to return.");
            return;
        }
        LocalDate returnDate = Optional.ofNullable(returnDatePicker.getValue()).orElse(LocalDate.now());
        try {
            apiClient.returnBook(loan.getId(), returnDate);
            refreshAll();
            returnDatePicker.setValue(null);
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    private void refreshAll() {
        if (apiClient == null) return;
        try {
            bookItems.setAll(apiClient.getBooks());
            userItems.setAll(apiClient.getUsers());
            loanItems.setAll(apiClient.getLoans());
            userSelect.setItems(userItems);
            bookSelect.setItems(bookItems.filtered(BookDTO::isAvailable));
            activeLoanSelect.setItems(FXCollections.observableArrayList(apiClient.getActiveLoans()));
        } catch (IOException | InterruptedException e) {
            showError("Failed to fetch data: " + e.getMessage());
        }
    }

    private void clearBookInputs() {
        bookTitleInput.clear();
        bookAuthorInput.clear();
        bookCopiesInput.clear();
    }

    private void clearUserInputs() {
        userNameInput.clear();
        userEmailInput.clear();
    }

    private int parseIntOrDefault(String value, int defaultValue) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return defaultValue;
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private void showError(String message) {
        Platform.runLater(() -> {
            Alert alert = new Alert(Alert.AlertType.ERROR);
            alert.setContentText(message);
            alert.showAndWait();
        });
    }

    private Optional<BookDTO> findBook(java.util.UUID id) {
        return bookItems.stream().filter(b -> b.getId().equals(id)).findFirst();
    }

    private Optional<UserDTO> findUser(java.util.UUID id) {
        return userItems.stream().filter(u -> u.getId().equals(id)).findFirst();
    }
}
