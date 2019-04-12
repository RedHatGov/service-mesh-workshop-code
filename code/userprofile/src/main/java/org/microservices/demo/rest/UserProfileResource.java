/**
 * User Profile REST Resource
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.rest;

import java.util.Set;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.microservices.demo.json.UserProfile;
import org.microservices.demo.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;

// using JAX-RS
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserProfileResource {

    // Using Spring-DI
    @Autowired
    UserProfileService userProfileService;

    @GET
    public Set<UserProfile> getProfiles() {
        return userProfileService.getProfiles();
    }

    @POST
    public Response createProfile(UserProfile profile) {
        if(userProfileService.createProfile(profile)) {
            return Response.status(Response.Status.CREATED).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    }          

    @GET
    @Path("/{id}")
        // tODO: add not null on params
    public Response getProfile(@PathParam("id") String id) {
        UserProfile profile = userProfileService.getProfile(id);
        Response.Status status = (profile != null) ? Response.Status.OK : Response.Status.NOT_FOUND;
        return Response.status(status).entity(profile).build();
    }    


    @PUT
    @Path("/{id}")
    // tODO: add not null on params
    public Response updateProfile(UserProfile profile, @PathParam("id") String id) {
        // does it exist
        if(userProfileService.updateProfile(profile, id)) {
            return Response.status(Response.Status.NO_CONTENT).build();
        }
        return Response.status(Response.Status.BAD_REQUEST).build();
    } 
}