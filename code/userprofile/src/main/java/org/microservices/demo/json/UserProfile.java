/**
 * User Profile Service
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.json;

import java.util.Objects;


public class UserProfile {
    private String id;
    private String firstname;
    private String lastname;
    private String about;

    public UserProfile() {

    }
    public UserProfile(String id, String firstname, String lastname, String about) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.about = about;
    }
    /**
     * @return the userId
     */
    public String getId() {
        return id;
    }

    /**
     * @param userId the userId to set
     */
    public void setId(String userId) {
        this.id = userId;
    }

    /**
     * @return the firstName
     */
    public String getFirstName() {
        return firstname;
    }

    /**
     * @param firstName the firstName to set
     */
    public void setFirstName(String firstName) {
        this.firstname = firstName;
    }

    /**
     * @return the lastName
     */
    public String getLastName() {
        return lastname;
    }

    /**
     * @param lastName the lastName to set
     */
    public void setLastName(String lastName) {
        this.lastname = lastName;
    }

    /**
     * @return the about
     */
    public String getAbout() {
        return about;
    }

    /**
     * @param about the about to set
     */
    public void setAbout(String about) {
        this.about = about;
    }

    @Override
    public int hashCode() {
       return Objects.hash(this.id);
    }


    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        UserProfile other = (UserProfile) obj;
        return Objects.equals(other.id, this.id);
    }
}