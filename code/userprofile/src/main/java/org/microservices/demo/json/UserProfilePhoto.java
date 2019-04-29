/**
 * User Profile Photo
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 *
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.json;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class UserProfilePhoto {

    @NotBlank(message="Id cannot be blank")
    private String id;

    @NotNull(message="the image is required")
    private byte[] image;

    @NotBlank(message="filename is required")
    private String fileName;

    public UserProfilePhoto(String id, byte[] image, String fileName) {
        this.id = id;
        this.image = image;
        this.fileName = fileName;
    }
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public byte[] getImage() {
        return image;
    }

    public void setImage(byte[] image) {
        this.image = image;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        UserProfilePhoto that = (UserProfilePhoto) o;

        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }

    @Override
    public String toString() {
        return "UserProfilePhoto{" +
                "id='" + id + '\'' +
                ", fileName='" + fileName + '\'' +
                '}';
    }
}
