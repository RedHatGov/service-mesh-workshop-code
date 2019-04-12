/**
 * User Profile Service
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.rest;

import java.util.Set;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Iterator;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.jboss.resteasy.annotations.Body;
import org.jboss.resteasy.annotations.Status;
import org.microservices.demo.json.UserProfile;

@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserProfileResource {

    // test
    private Set<UserProfile> profiles = Collections.newSetFromMap(Collections.synchronizedMap(new LinkedHashMap<>()));
    // TODO: move service logic to service class

    public UserProfileResource() {
        profiles.add(new UserProfile("adtaylor", "Gbenga", "Taylor", "average SA"));
        profiles.add(new UserProfile("dudash", "Jason", "Dudash", "Senior Builder SA"));
    }
    @GET
    public Set<UserProfile> getProfiles() {
        return profiles;
    }

    @POST
    public Response createProfile(UserProfile profile) {
        // does it exist
        if(profile != null) {
            for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
                UserProfile existing = it.next();
                if (existing.getId().equals(profile.getId()))
                  return Response.status(Response.Status.BAD_REQUEST).build();
            }
            profiles.add(profile);
        }
        return Response.status(Response.Status.CREATED).build();
    }          

    @GET
    @Path("/{id}")
        // tODO: add not null on params
    public UserProfile getProfile(@PathParam("id") String userid) {
        for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
            UserProfile profile = it.next();
            if (userid.equals(profile.getId()))
               return profile;
        }
        return null; 
    }    


    @PUT
    @Path("/{id}")
    // tODO: add not null on params
    public Response updateProfile(UserProfile profile, @PathParam("id") String userid) {
        // does it exist
        if(profile != null) {
            for (Iterator<UserProfile> it = profiles.iterator(); it.hasNext(); ) {
                UserProfile existing = it.next();
                if (userid.equals(existing.getId()) && userid.equals(profile.getId())){
                    existing.setFirstName(profile.getFirstName());
                    existing.setLastName(profile.getLastName());
                    existing.setAbout(profile.getAbout());
                    return Response.status(Response.Status.NO_CONTENT).build();
                }               
            }
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    } 


    //TODO: 
    // add validations for what's required or not using JSR
    //id required
    // first and last name
    // about is optional
    // make sure all passed objects are not null
}