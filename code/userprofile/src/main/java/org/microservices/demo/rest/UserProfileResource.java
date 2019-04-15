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

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
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
import org.springframework.beans.factory.annotation.Qualifier;

// using JAX-RS
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserProfileResource {

    // Using Spring-DI
    @Autowired
    //@Qualifier("${user.profile.source}")
    //TODO: figure how to make this more configurable at runtime
    // spring boot has ConditionalOnProperty that can be set on bean. can the quarkus springDI processor
    // handle this...probably not at the moment. 
    // for now in dev mode this can be done by modifying the hardcoded value then saving the file and letting hot deploy do it's thing
    @Qualifier("jpa")
    //@Qualifier("memory")
    protected UserProfileService userProfileService;

    @GET
    public Set<UserProfile> getProfiles() {
        return userProfileService.getProfiles();
        // if had return Response.ok(profiles).build(), would require @RegisterForReflection on the bean
    }

    @POST
    public Response createProfile(@Valid @NotNull UserProfile profile) {
        return userProfileService.createProfile(profile) ?
               Response.status(Response.Status.CREATED).build(): 
               Response.status(Response.Status.BAD_REQUEST).build();
    }          

    @GET
    @Path("/{id}")
    public Response getProfile(@PathParam("id") String id) {
        UserProfile profile = userProfileService.getProfile(id);
        Response.Status status = (profile != null) ? Response.Status.OK : Response.Status.NOT_FOUND;
        return Response.status(status).entity(profile).build();
    }    


    @PUT
    @Path("/{id}")
    public Response updateProfile(@Valid @NotNull UserProfile profile, 
                                  @PathParam("id") String id) {
        // does it exist
        return userProfileService.updateProfile(profile, id) ?
             Response.status(Response.Status.NO_CONTENT).build() :
             Response.status(Response.Status.BAD_REQUEST).build();
    } 
}