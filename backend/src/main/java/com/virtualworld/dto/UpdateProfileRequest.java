package com.virtualworld.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequest {

    @Size(max = 100, message = "Display name must be under 100 characters")
    private String displayName;

    @Size(max = 300, message = "Bio must be under 300 characters")
    private String bio;

    // JSON string for avatar configuration
    private String avatarConfig;
}
