package com.example.library;

import com.example.library.service.LibraryService;
import com.example.library.storage.FileStorageProvider;
import com.example.library.storage.StorageProvider;
import com.example.library.ui.LibraryController;
import java.nio.file.Path;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

public class LibraryApp extends Application {
    @Override
    public void start(Stage primaryStage) throws Exception {
        StorageProvider storage = new FileStorageProvider(Path.of("data"));
        LibraryService service = new LibraryService(storage);

        FXMLLoader loader = new FXMLLoader(getClass().getResource("/com/example/library/layout.fxml"));
        Parent root = loader.load();
        LibraryController controller = loader.getController();
        controller.setService(service);

        Scene scene = new Scene(root, 1200, 800);
        primaryStage.setTitle("Library Management System");
        primaryStage.setScene(scene);
        primaryStage.setResizable(true);
        primaryStage.setMinWidth(900);
        primaryStage.setMinHeight(600);
        
        // Set application icon
        try {
            Image icon = new Image(getClass().getResourceAsStream("/com/example/library/book-icon.jpg"));
            primaryStage.getIcons().add(icon);
        } catch (Exception e) {
            System.err.println("Could not load icon: " + e.getMessage());
        }
        
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}
