/**
 * User Profile Persistent
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.jpa;

import java.sql.Date;
import java.util.Objects;

import javax.persistence.*;

/**
 * User Profile 
 */
@Entity
@Table(name = "user_profile")
@NamedQuery(name = "UserProfileJPA.findAll",
      query = "SELECT f FROM UserProfileJPA f ORDER BY f.id",
      hints = @QueryHint(name = "org.hibernate.cacheable", value = "true") )
@Cacheable
public class UserProfileJPA {

    @Id
    private String id;

    private String firstName;

    private String lastName;

    private String aboutMe;

    private String emailAddress;

    private Date createdAt;

    // storing image in db. in future, this can be stored in object store
    @Lob // TODO: this should ideally be in separate table or another db
    // or at least make this transient or lazy loaded
    private String image; //base64 representation of image

    private String imageFileName; // file name of image

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getAboutMe() {
        return aboutMe;
    }

    public void setAboutMe(String aboutMe) {
        this.aboutMe = aboutMe;
    }

    public String getEmailAddress() {
        return emailAddress;
    }

    public void setEmailAddress(String emailAddress) {
        this.emailAddress = emailAddress;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = new Date(createdAt);
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public String getImageFileName() {
        return imageFileName;
    }

    public void setImageFileName(String imageFileName) {
        this.imageFileName = imageFileName;
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
        UserProfileJPA other = (UserProfileJPA) obj;
        return Objects.equals(other.id, this.id);
    }  
}