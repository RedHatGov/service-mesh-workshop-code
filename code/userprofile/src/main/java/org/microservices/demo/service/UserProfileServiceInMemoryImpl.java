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
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Set;

import org.apache.commons.codec.binary.StringUtils;
import org.microservices.demo.json.UserProfile;
import org.springframework.stereotype.Service;

@Service("memory")
public class UserProfileServiceInMemoryImpl implements UserProfileService {
    
    // test
    private Set<UserProfile> profiles = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));

    // in service class, exception handling

    public UserProfileServiceInMemoryImpl() {
        profiles.add(new UserProfile("adtaylor", "Gbenga", "Taylor", "average SA"));
        profiles.add(new UserProfile("dudash", "Jason", "Dudash", "Senior Builder SA"));
    }

    @Override
    public boolean createProfile(UserProfile profile) {
        // does it exist
        if(profile != null) {
            for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
                UserProfile existing = it.next();
                if (StringUtils.equals(existing.getId(), profile.getId()))
                  return false;
            }
            profile.setCreatedAt(Calendar.getInstance().getTime());
            profiles.add(profile);
        }
        return true;
    }

    @Override
    public UserProfile getProfile(String id) {
        for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
            UserProfile profile = it.next();
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
    public boolean updateProfile(UserProfile profile, String id) {
        if(profile != null) {
            for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
                UserProfile existing = it.next();
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
}