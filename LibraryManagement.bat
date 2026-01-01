@echo off
REM Library Management System - Desktop Application
REM This batch file runs the Library Management application

REM Set the directory where the JAR is located
set JAR_DIR=%~dp0
set JAR_PATH=%JAR_DIR%target\LibraryManagement.jar

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Java is not installed or not in system PATH
    echo Please install Java 21 or higher from https://www.oracle.com/java/technologies/
    echo.
    pause
    exit /b 1
)

REM Run the application with JavaFX module options
echo Starting Library Management System...
java --module-path C:\javafx-sdk-25.0.1\lib ^
     --add-modules javafx.controls,javafx.fxml ^
     -jar "%JAR_PATH%"

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to run the application
    echo Please ensure JavaFX SDK is installed at C:\javafx-sdk-25.0.1
    echo.
    pause
)
