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

import org.microservices.demo.json.UserProfile;
import org.springframework.stereotype.Service;

@Service("jpa")
public class UserProfileJPAServiceImpl implements UserProfileService {

    @Override
    public boolean createProfile(UserProfile profile) {
        return false;
    }

    @Override
    public UserProfile getProfile(String id) {
        return null;
    }

    @Override
    public Set<UserProfile> getProfiles() {
        return null;
    }

    @Override
    public boolean updateProfile(UserProfile profile, String id) {
        return false;
    }
    
}