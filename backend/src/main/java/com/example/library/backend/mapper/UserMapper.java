package com.example.library.backend.mapper;

import com.example.library.backend.model.UserEntity;
import com.example.library.common.dto.UserDTO;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserDTO toDto(UserEntity entity) {
        return new UserDTO(
                entity.getId(),
                entity.getName(),
                entity.getEmail()
        );
    }

    public UserEntity toEntity(UserDTO dto) {
        return new UserEntity(
                dto.getId(),
                dto.getName(),
                dto.getEmail()
        );
    }
}
