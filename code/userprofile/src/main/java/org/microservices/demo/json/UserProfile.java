/**
 * User Profile 
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.json;

import java.util.Calendar;
import java.util.Date;
import java.util.Objects;

/**
 * User Profile 
 */
//TODO: add JSR validations
    //TODO: 
    // add validations for what's required or not using JSR
    //id required
    // first and last name
    // about is optional
    // make sure all passed objects are not null
public class UserProfile {
    private String id;
    private String firstName;
    private String lastName;
    private String aboutMe;
    private String emailAddress;
    private Date createdAt;

    public UserProfile() {

    }
    public UserProfile(String id, String firstname, String lastname, String aboutme) {
        this.id = id;
        this.firstName = firstname;
        this.lastName = lastname;
        this.aboutMe = aboutme;
        this.createdAt = Calendar.getInstance().getTime();
    }
    

    /**
     * @return the id
     */
    public String getId() {
        return id;
    }

    /**
     * @param id the id to set
     */
    public void setId(String id) {
        this.id = id;
    }

    /**
     * @return the firstName
     */
    public String getFirstName() {
        return firstName;
    }

    /**
     * @param firstName the firstName to set
     */
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    /**
     * @return the lastName
     */
    public String getLastName() {
        return lastName;
    }

    /**
     * @param lastName the lastName to set
     */
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    /**
     * @return the aboutMe
     */
    public String getAboutMe() {
        return aboutMe;
    }

    /**
     * @param aboutMe the aboutMe to set
     */
    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    /**
     * @return the emailAddress
     */
    public String getEmailAddress() {
        return emailAddress;
    }

    /**
     * @param emailAddress the emailAddress to set
     */
    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    /**
     * @return the createdAt
     */
    public Date getCreatedAt() {
        return createdAt;
    }

    /**
     * @param createdAt the createdAt to set
     */
    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
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