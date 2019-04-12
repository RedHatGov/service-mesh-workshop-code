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
import org.springframework.stereotype.Service;

/**
 * Persistent User Profile Service. Data is stored in a relational database
 */
@Service("jpa")
public class UserProfileJPAServiceImpl implements UserProfileService {

    @Override
    public boolean createProfile(@Valid @NotNull UserProfile profile) {
        return false;
    }

    @Override
    public boolean updateProfile(@Valid @NotNull UserProfile profile, @NotBlank String id) {
        return false;
    }

    @Override
    public Set<UserProfile> getProfiles() {
        return null;
    }

    @Override
    public UserProfile getProfile(@NotBlank String id) {
        return null;
    }
}