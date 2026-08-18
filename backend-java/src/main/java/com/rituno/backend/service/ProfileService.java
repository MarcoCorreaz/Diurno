package com.rituno.backend.service;

import com.rituno.backend.dto.ProfileRequest;
import com.rituno.backend.dto.ProfileResponse;
import com.rituno.backend.model.Profile;
import com.rituno.backend.repository.ProfileRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.UUID;

@Service
public class ProfileService {

    private final ProfileRepository profileRepository;

    public ProfileService(ProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getProfile(String userIdStr) {
        UUID userId = UUID.fromString(userIdStr);
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));
        return mapToResponse(profile);
    }

    @Transactional
    public ProfileResponse updateProfile(String userIdStr, ProfileRequest request) {
        UUID userId = UUID.fromString(userIdStr);
        Profile profile = profileRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile not found"));

        if (request.name() != null) profile.setName(request.name());
        if (request.goal() != null) profile.setGoal(request.goal());
        if (request.energy() != null) profile.setEnergy(request.energy());
        if (request.routineDetails() != null) profile.setRoutineDetails(request.routineDetails());

        Profile updatedProfile = profileRepository.save(profile);
        return mapToResponse(updatedProfile);
    }

    private ProfileResponse mapToResponse(Profile profile) {
        return new ProfileResponse(
                profile.getId(),
                profile.getName(),
                profile.getEmail(),
                profile.getGoal(),
                profile.getEnergy(),
                profile.getRoutineDetails(),
                profile.getPlan(),
                profile.getCreatedAt(),
                profile.getUpdatedAt()
        );
    }
}
