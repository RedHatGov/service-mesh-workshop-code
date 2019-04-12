/**
 * User Profile Service
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.service;

import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.microservices.demo.json.UserProfile;

/**
 * User Profile Service
 * Segregating service from rest resource.
 */
//TODO: JSR validations and exception handling 
// TODO: validations on parameters
public interface UserProfileService {
    /**
     * Create a profile
     * @param profile Profile to create
     * @return true if successful, false if issues (for e.g profile already exists)
     */
    boolean createProfile(@Valid @NotNull UserProfile profile);
    /**
     * Update a profile
     * @param profile Profile to update
     * @param id ID of profile to update
     * @return true if successful, false if issues (for e.g profile doesn't exists)
     */  
    boolean updateProfile(@Valid @NotNull UserProfile profile, @NotBlank String id);
    /**
     * Return all profiles
     * @return all profiles
     */   
    Set<UserProfile> getProfiles();

    /**
     * return a specific profile
     * @param id
     * @return the specified profile
     */
    UserProfile getProfile(@NotBlank String id);
}