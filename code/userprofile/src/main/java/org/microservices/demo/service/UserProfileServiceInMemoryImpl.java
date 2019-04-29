/**
 * User Profile Service
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.service;

import java.util.Calendar;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Set;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.apache.commons.codec.binary.StringUtils;
import org.microservices.demo.json.UserProfile;
import org.microservices.demo.json.UserProfilePhoto;
import org.springframework.stereotype.Service;

/**
 * In-memory User Profile Service. this is for testing purposes
 */
@Service("memory")
public class UserProfileServiceInMemoryImpl implements UserProfileService {
    // test
    private Set<UserProfile> profiles = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));

    public UserProfileServiceInMemoryImpl() {
        profiles.add(new UserProfile("adtaylor", "Gbenga", "Taylor", "average SA"));
        profiles.add(new UserProfile("dudash", "Jason", "Dudash", "Senior Builder SA"));

    }

    @Override
    public boolean createProfile(@Valid @NotNull UserProfile profile) {
        // does it exist
        if(profile != null) {
            for(UserProfile existing : profiles) {
                if (StringUtils.equals(existing.getId(), profile.getId()))
                  return false;
            }
            profile.setCreatedAt(Calendar.getInstance().getTime());
            profiles.add(profile);
        }
        return true;
    }

    @Override
    public UserProfile getProfile(@NotBlank String id) {
        for(UserProfile profile : profiles) {
            if (StringUtils.equals(id, profile.getId()))
               return profile;
        }
        return null;
    }

    @Override
    public Set<UserProfile> getProfiles() {
        return profiles;
    }

    @Override
    public boolean updateProfile(@Valid @NotNull UserProfile profile, @NotBlank String id) {
        if(profile != null) {
           for(UserProfile existing : profiles) {
                if(StringUtils.equals(id, existing.getId()) &&
                    StringUtils.equals(id, profile.getId())) {
                    existing.setFirstName(profile.getFirstName());
                    existing.setLastName(profile.getLastName());
                    existing.setAboutMe(profile.getAboutMe());
                    existing.setEmailAddress(profile.getEmailAddress());
                    return true;
                }               
            }
        }
        return false;
    }

    @Override
    public UserProfilePhoto getUserProfilePhoto(@NotBlank String id) {
        return null;
    }

    @Override
    public boolean saveUserProfilePhoto(@Valid UserProfilePhoto userProfilePhoto) {
        return false;
    }
}