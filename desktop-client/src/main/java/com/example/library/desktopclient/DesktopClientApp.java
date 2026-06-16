package com.example.library.desktopclient;

import com.example.library.desktopclient.client.LibraryApiClient;
import com.example.library.desktopclient.controller.LibraryController;
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Parent;
import javafx.scene.Scene;
import javafx.scene.image.Image;
import javafx.stage.Stage;

public class DesktopClientApp extends Application {

    private static final String API_BASE_URL = "http://localhost:8080/api";

    @Override
    public void start(Stage primaryStage) throws Exception {
        LibraryApiClient apiClient = new LibraryApiClient(API_BASE_URL);

        FXMLLoader loader = new FXMLLoader(
                getClass().getResource("/com/example/library/desktopclient/layout.fxml"));
        Parent root = loader.load();
        LibraryController controller = loader.getController();
        controller.setApiClient(apiClient);

        Scene scene = new Scene(root, 1200, 800);
        primaryStage.setTitle("Library Management System (REST Client)");
        primaryStage.setScene(scene);
        primaryStage.setResizable(true);
        primaryStage.setMinWidth(900);
        primaryStage.setMinHeight(600);

        try {
            Image icon = new Image(
                    getClass().getResourceAsStream("/com/example/library/desktopclient/book-icon.jpg"));
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
