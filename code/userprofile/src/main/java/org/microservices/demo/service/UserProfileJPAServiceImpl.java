/**
 * User Profile Service
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.service;

import java.util.*;


import javax.persistence.EntityManager;
import javax.transaction.Transactional;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import org.apache.commons.codec.binary.StringUtils;
import org.microservices.demo.jpa.UserProfileJPA;
import org.microservices.demo.json.UserProfile;
import org.microservices.demo.json.UserProfilePhoto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Persistent User Profile Service. Data is stored in a relational database
 */
@Service("jpa")
public class UserProfileJPAServiceImpl implements UserProfileService {

    @Autowired
    EntityManager entityManager;

    @Autowired
    ImageBase64Processor imageBase64Processor;

    static Map<String, String> photos = new HashMap<>();

    @Override
    @Transactional
    public boolean createProfile(@Valid @NotNull UserProfile profile) {
        // if it doesn't exist
        UserProfileJPA existing = findExisting(profile.getId());
        if (existing == null) {
            profile.setCreatedAt(Calendar.getInstance().getTime());
            saveProfile(profile);
            return true;
        }
        return false;
    }

    @Override
    @Transactional
    public boolean updateProfile(@Valid @NotNull UserProfile profile, @NotBlank String id) {
        //does it exist and do ids match
        UserProfileJPA existing = findExisting(id);
        if (existing != null && StringUtils.equals(id, profile.getId())) {
            profile.setCreatedAt(existing.getCreatedAt());
            copyProfile(profile, existing);
            saveProfile(existing); // this save not really needed
            return true;
        }
        return false;
    }




    @Override
    public Set<UserProfile> getProfiles() {
        return copyDbProfiles(entityManager.createNamedQuery("UserProfileJPA.findAll", UserProfileJPA.class)
                    .getResultList().toArray(new UserProfileJPA[0]));
    }


    @Override
    public UserProfile getProfile(@NotBlank String id) {
        UserProfileJPA dbProfile = findExisting(id);
        return copyDbProfile(dbProfile);
    }

    @Override
    public UserProfilePhoto getUserProfilePhoto(@NotBlank String id) {
        UserProfilePhoto userProfilePhoto =  null;
        UserProfileJPA existing = findExisting(id);
        if(existing != null) {
            userProfilePhoto =  populateUserProfilePhoto(existing);
        }
        return userProfilePhoto;
    }


    @Override
    @Transactional
    public boolean saveUserProfilePhoto(@Valid UserProfilePhoto userProfilePhoto) {
        UserProfileJPA existing = findExisting(userProfilePhoto.getId());
        if(existing != null) {
            populateUserJPAProfilePhoto(existing, userProfilePhoto);
            saveProfile(existing);
            return true;
        }
        return false;
    }


    /**
     * saves the profile to the db
     */
    protected void saveProfile(@NotNull UserProfile profile) {
        saveProfile(copyProfile(profile));
    }
    /**
     * saves the profile to the db
     */
    protected void saveProfile(@NotNull UserProfileJPA profile) {
        entityManager.persist(profile);
    }

    /**
     * find existing profile
     * @param id
     * @return
     */
    protected UserProfileJPA findExisting(@NotBlank String id) {
        return entityManager.find(UserProfileJPA.class, id);
    }
    /**
     * COPY METHODS
     * TODO: use something like mapstruct
     */

    protected UserProfile copyDbProfile(UserProfileJPA dbProfile) {
        UserProfile profile = null;
        if(dbProfile != null) {
            profile = new UserProfile();
            profile.setAboutMe(dbProfile.getAboutMe());
            profile.setCreatedAt(dbProfile.getCreatedAt().getTime());
            profile.setEmailAddress(dbProfile.getEmailAddress());
            profile.setId(dbProfile.getId());
            profile.setFirstName(dbProfile.getFirstName());
            profile.setLastName(dbProfile.getLastName());
        }
        return profile;
    }

    protected UserProfileJPA copyProfile(UserProfile profile) {
        UserProfileJPA dbProfile = null;
        if(profile != null) {
            dbProfile = new UserProfileJPA();
            copyProfile(profile, dbProfile);
        }
        return dbProfile;
    }    


    protected void copyProfile(UserProfile profile, @NotNull UserProfileJPA dbProfile) {
        dbProfile.setAboutMe(profile.getAboutMe());
        dbProfile.setCreatedAt(profile.getCreatedAt().getTime());
        dbProfile.setEmailAddress(profile.getEmailAddress());
        dbProfile.setId(profile.getId());
        dbProfile.setFirstName(profile.getFirstName());
        dbProfile.setLastName(profile.getLastName());
    }

    protected Set<UserProfile> copyDbProfiles(UserProfileJPA[] dbProfiles) {
        Set<UserProfile> profiles = new HashSet<>();
        for(UserProfileJPA dbProfile : dbProfiles) {
            profiles.add(copyDbProfile(dbProfile));
        }
        return profiles;
    }
    // TODO: fix
    protected void populateUserJPAProfilePhoto(UserProfileJPA existing, @Valid UserProfilePhoto userProfilePhoto) {
        // temp test
        String encoded = imageBase64Processor.encodToBase64Binary(userProfilePhoto.getImage());
       // System.out.println("encoded " + encoded);
        photos.put(existing.getId(), encoded);
        // should be populate
    }

    // TODO: fix
    protected UserProfilePhoto populateUserProfilePhoto(UserProfileJPA existing) {
        UserProfilePhoto userProfilePhoto = null;
     //   System.out.println("--------about to retrieve bytes via base 64");
        if(existing != null) {
        //    System.out.println("base64 " + photos.get(existing.getId()));

            // TODO: add a check to make sure image is not null
            if(photos.get(existing.getId()) != null) {
                userProfilePhoto = new UserProfilePhoto(existing.getId(),
                        imageBase64Processor.decodeBase64(photos.get(existing.getId())) /* this should be decode(existing.getImage))*/,
                        existing.getId() /*this should be file name , fix later */);
            }
        }
        return userProfilePhoto;
    }
}