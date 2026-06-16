package com.example.library.ui;

import com.example.library.model.Book;
import com.example.library.model.Loan;
import com.example.library.model.User;
import com.example.library.service.LibraryService;
import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;
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
    private LibraryService service;

    private final ObservableList<Book> bookItems = FXCollections.observableArrayList();
    private final ObservableList<User> userItems = FXCollections.observableArrayList();
    private final ObservableList<Loan> loanItems = FXCollections.observableArrayList();

    @FXML private TableView<Book> booksTable;
    @FXML private TableColumn<Book, String> bookTitleColumn;
    @FXML private TableColumn<Book, String> bookAuthorColumn;
    @FXML private TableColumn<Book, Integer> bookAvailableColumn;
    @FXML private TableColumn<Book, Integer> bookTotalColumn;
    @FXML private TextField bookTitleInput;
    @FXML private TextField bookAuthorInput;
    @FXML private TextField bookCopiesInput;

    @FXML private TableView<User> usersTable;
    @FXML private TableColumn<User, String> userNameColumn;
    @FXML private TableColumn<User, String> userEmailColumn;
    @FXML private TextField userNameInput;
    @FXML private TextField userEmailInput;

    @FXML private TableView<Loan> loansTable;
    @FXML private TableColumn<Loan, String> loanBookColumn;
    @FXML private TableColumn<Loan, String> loanUserColumn;
    @FXML private TableColumn<Loan, String> loanBorrowedColumn;
    @FXML private TableColumn<Loan, String> loanDueColumn;
    @FXML private TableColumn<Loan, String> loanReturnedColumn;
    @FXML private TableColumn<Loan, String> loanFineColumn;

    @FXML private ComboBox<User> userSelect;
    @FXML private ComboBox<Book> bookSelect;
    @FXML private TextField loanDaysInput;

    @FXML private ComboBox<Loan> activeLoanSelect;
    @FXML private DatePicker returnDatePicker;

    public void setService(LibraryService service) {
        this.service = service;
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
        loanBookColumn.setCellValueFactory(data -> {
            Book book = findBook(data.getValue().getBookId());
            return javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> book.getTitle()));
        });
        loanUserColumn.setCellValueFactory(data -> {
            User user = findUser(data.getValue().getUserId());
            return javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> user.getName()));
        });
        loanBorrowedColumn.setCellValueFactory(data -> javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> data.getValue().getBorrowedDate().toString())));
        loanDueColumn.setCellValueFactory(data -> javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> data.getValue().getDueDate().toString())));
        loanReturnedColumn.setCellValueFactory(data -> javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> Optional.ofNullable(data.getValue().getReturnedDate()).map(LocalDate::toString).orElse("-"))));
        loanFineColumn.setCellValueFactory(data -> javafx.beans.property.SimpleStringProperty.stringExpression(javafx.beans.binding.Bindings.createStringBinding(() -> Optional.ofNullable(data.getValue().getFineAccrued()).map(Object::toString).orElse("0.00"))));
        loansTable.setItems(loanItems);
    }

    private void setupComboBoxes() {
        userSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(User user) {
                return user == null ? "" : user.getName();
            }

            @Override
            public User fromString(String s) {
                return null;
            }
        });
        bookSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(Book book) {
                return book == null ? "" : book.getTitle();
            }

            @Override
            public Book fromString(String s) {
                return null;
            }
        });
        activeLoanSelect.setConverter(new StringConverter<>() {
            @Override
            public String toString(Loan loan) {
                if (loan == null) {
                    return "";
                }
                Book book = findBook(loan.getBookId());
                User user = findUser(loan.getUserId());
                return user.getName() + " - " + book.getTitle();
            }

            @Override
            public Loan fromString(String s) {
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
        service.addBook(title.trim(), author.trim(), copies);
        clearBookInputs();
        refreshAll();
    }

    @FXML
    private void handleAddUser() {
        String name = userNameInput.getText();
        String email = userEmailInput.getText();
        if (isBlank(name) || isBlank(email)) {
            showError("Name and email are required.");
            return;
        }
        service.addUser(name.trim(), email.trim());
        clearUserInputs();
        refreshAll();
    }

    @FXML
    private void handleBorrow() {
        User user = userSelect.getValue();
        Book book = bookSelect.getValue();
        if (user == null || book == null) {
            showError("Select a user and a book.");
            return;
        }
        int days = parseIntOrDefault(loanDaysInput.getText(), 14);
        try {
            service.borrowBook(user.getId(), book.getId(), days);
            refreshAll();
            loanDaysInput.clear();
        } catch (Exception ex) {
            showError(ex.getMessage());
        }
    }

    @FXML
    private void handleReturn() {
        Loan loan = activeLoanSelect.getValue();
        if (loan == null) {
            showError("Select a loan to return.");
            return;
        }
        LocalDate returnDate = Optional.ofNullable(returnDatePicker.getValue()).orElse(LocalDate.now());
        service.returnBook(loan.getId(), returnDate);
        refreshAll();
        returnDatePicker.setValue(null);
    }

    private void refreshAll() {
        if (service == null) {
            return;
        }
        bookItems.setAll(service.getBooks());
        userItems.setAll(service.getUsers());
        loanItems.setAll(service.getLoans());
        userSelect.setItems(userItems);
        bookSelect.setItems(bookItems.filtered(Book::isAvailable));
        activeLoanSelect.setItems(FXCollections.observableArrayList(service.getActiveLoans()));
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
        Alert alert = new Alert(Alert.AlertType.ERROR);
        alert.setContentText(message);
        alert.showAndWait();
    }

    private Book findBook(UUID id) {
        return service.getBooks().stream().filter(b -> b.getId().equals(id)).findFirst().orElseThrow();
    }

    private User findUser(UUID id) {
        return service.getUsers().stream().filter(u -> u.getId().equals(id)).findFirst().orElseThrow();
    }
}
