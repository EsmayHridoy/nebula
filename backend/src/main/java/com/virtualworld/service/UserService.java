package com.virtualworld.service;

import com.virtualworld.dto.AuthDtos.UserDto;
import com.virtualworld.dto.UpdateProfileRequest;
import com.virtualworld.entity.User;
import com.virtualworld.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDto getProfile(User currentUser) {
        return AuthService.toUserDto(currentUser);
    }

    @Transactional
    public UserDto updateProfile(User currentUser, UpdateProfileRequest request) {
        if (request.getDisplayName() != null) {
            currentUser.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            currentUser.setBio(request.getBio());
        }
        if (request.getAvatarConfig() != null) {
            currentUser.setAvatarConfig(request.getAvatarConfig());
        }

        User updated = userRepository.save(currentUser);
        log.info("Profile updated for user: {}", currentUser.getUsername());
        return AuthService.toUserDto(updated);
    }

    public UserDto getPublicProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        // Return only public info
        return UserDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .avatarConfig(user.getAvatarConfig())
                .build();
    }
}
