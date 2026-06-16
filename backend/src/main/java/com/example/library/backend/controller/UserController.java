package com.example.library.backend.controller;

import com.example.library.backend.mapper.UserMapper;
import com.example.library.backend.service.LibraryService;
import com.example.library.common.dto.UserDTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "User management endpoints")
public class UserController {

    private final LibraryService libraryService;
    private final UserMapper userMapper;

    public UserController(LibraryService libraryService, UserMapper userMapper) {
        this.libraryService = libraryService;
        this.userMapper = userMapper;
    }

    @GetMapping
    @Operation(summary = "Get all users")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = libraryService.getUsers().stream()
                .map(userMapper::toDto)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PostMapping
    @Operation(summary = "Add a new user")
    public ResponseEntity<UserDTO> addUser(
            @RequestParam @NotBlank String name,
            @RequestParam @NotBlank String email) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(userMapper.toDto(libraryService.addUser(name, email)));
    }
}
