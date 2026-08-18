package com.rituno.backend.controller;

import com.rituno.backend.dto.ProfileRequest;
import com.rituno.backend.dto.ProfileResponse;
import com.rituno.backend.service.ProfileService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<ProfileResponse> getProfile(Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.getProfile(userId));
    }

    @PutMapping
    public ResponseEntity<ProfileResponse> updateProfile(
            Authentication authentication,
            @RequestBody ProfileRequest request) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(profileService.updateProfile(userId, request));
    }
}
