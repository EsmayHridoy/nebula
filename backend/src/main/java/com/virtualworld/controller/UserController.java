package com.virtualworld.controller;

import com.virtualworld.dto.AuthDtos.UserDto;
import com.virtualworld.dto.UpdateProfileRequest;
import com.virtualworld.entity.User;
import com.virtualworld.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(userService.getProfile(currentUser));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(userService.updateProfile(currentUser, request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getPublicProfile(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getPublicProfile(id));
    }

    // Admin only example
    @GetMapping("/admin/check")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminCheck() {
        return ResponseEntity.ok("You are an admin!");
    }
}
