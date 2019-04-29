/**
 * User Profile REST Resource
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

package org.microservices.demo.rest;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.List;
import java.util.Map;

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
import javax.ws.rs.core.MultivaluedMap;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.ResponseBuilder;

import org.apache.commons.io.IOUtils;
import org.eclipse.microprofile.openapi.annotations.media.Content;
import org.eclipse.microprofile.openapi.annotations.media.Schema;

import org.eclipse.microprofile.openapi.annotations.responses.APIResponse;
import org.h2.util.StringUtils;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.microservices.demo.json.UserProfile;
import org.microservices.demo.json.UserProfilePhoto;
import org.microservices.demo.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

// using JAX-RS
@Path("/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
//TODO: fix generated OpenAPI spec/swagger-ui. PUT and POST examples aren't generating the proper rer to UserProfile
public class UserProfileResource {

    // Using Spring-DI
    @Autowired
    // @Qualifier("${user.profile.source}")
    // TODO: figure how to make this more configurable at runtime
    // spring boot has ConditionalOnProperty that can be set on bean. can the
    // quarkus springDI processor
    // handle this...probably not at the moment.
    // for now in dev mode this can be done by modifying the hardcoded value then
    // saving the file and letting hot deploy do it's thing
    @Qualifier("jpa")
    // @Qualifier("memory")
    protected UserProfileService userProfileService;

    @GET
   /* @APIResponse(responseCode = "200", description = "User Profile Retrieved",
    content = @Content( 
                        mediaType = "application/json",
                        schema = @ArraySchema(implementation  = UserProfile.class))) */
    public Set<UserProfile> getProfiles() {
        return userProfileService.getProfiles();
        // if had return Response.ok(profiles).build(), would require
        // @RegisterForReflection on the bean
    }

    @POST
    @APIResponse(responseCode = "201", description = "User Profile Created") 
    @APIResponse(responseCode = "400", description = "Bad Request")
    // comment out JSR annotations so OpenAPI schema is generated
    // submitted https://github.com/quarkusio/quarkus/issues/2262s
    public Response createProfile(/*@Valid @NotNull*/ UserProfile profile) {
        return userProfileService.createProfile(profile) ? Response.status(Response.Status.CREATED).build()
                : Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("/{id}")
    @APIResponse(responseCode = "200", description = "User Profile Retrieved",
    content = @Content( 
                        mediaType = "application/json",
                        schema = @Schema(implementation = UserProfile.class))) // this usually isn't necessary with the smallrye-openapi feature but once you add APIResonse, 
                                                                            // it has to be specified
    @APIResponse(responseCode = "404", description = "User Profile Not Found")      
    public Response getProfile(@PathParam("id") String id) {
        UserProfile profile = userProfileService.getProfile(id);
        Response.Status status = (profile != null) ? Response.Status.OK : Response.Status.NOT_FOUND;
        return Response.status(status).entity(profile).build();
    }

    @PUT
    @Path("/{id}")
    @APIResponse(responseCode = "204", description = "User Profile Updated") 
    @APIResponse(responseCode = "400", description = "Bad Request")    
    // comment out JSR annotations so OpenAPI schema is generated
    public Response updateProfile(/*@Valid @NotNull*/ UserProfile profile, @PathParam("id") String id) {
        // does it exist
        return userProfileService.updateProfile(profile, id) ? Response.status(Response.Status.NO_CONTENT).build()
                : Response.status(Response.Status.BAD_REQUEST).build();
    }

// hat tip  - http://www.mastertheboss.com/jboss-frameworks/resteasy/using-rest-services-to-manage-download-and-upload-of-files
    @POST
    @Path("/{id}/photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @APIResponse(responseCode = "200", description = "User Profile Retrieved")
    @APIResponse(responseCode = "404", description = "User Profile Not Found")      
    // TODO -- better IO Exception handling
    public Response uploadPhoto(MultipartFormDataInput input, @PathParam("id") String id)  throws IOException {

        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
        List<InputPart> inputParts = uploadForm.get("image");
        byte[] bytes = null;
        String fileName = null;

        // extract image bytes from the stream
        for (InputPart inputPart : inputParts) {
                MultivaluedMap<String, String> header = inputPart.getHeaders();
                fileName = getFileName(header, id);
                // convert the uploaded file to inputstream
                InputStream inputStream = inputPart.getBody(InputStream.class, null);
               bytes = IOUtils.toByteArray(inputStream);
        }

        return userProfileService.saveUserProfilePhoto(new UserProfilePhoto(id, bytes, fileName)) ?
                Response.ok().build() :
                Response.status(Response.Status.BAD_REQUEST).build();
    } 

    @GET
    @Path("/{id}/photo")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    @APIResponse(responseCode = "200", description = "User Profile Photo Retrieved",
    content = @Content( 
                        mediaType = "application/octet-stream",
                        schema = @Schema())) 
    @APIResponse(responseCode = "404", description = "User Profile Photo Not Found")       
        // TODO -- better IO Exception handling
    public Response downloadPhoto(@PathParam("id") String id) throws IOException {

        UserProfilePhoto userProfilePhoto = userProfileService.getUserProfilePhoto(id);
        if(userProfilePhoto != null && !StringUtils.isNullOrEmpty(userProfilePhoto.getFileName())
                && userProfilePhoto.getImage() != null) {
            // temp local file
            String fileName = userProfilePhoto.getFileName();
            File file = new File(userProfilePhoto.getFileName());
            FileOutputStream fileOutputStream = new FileOutputStream(file);
            fileOutputStream.write(userProfilePhoto.getImage());
            fileOutputStream.flush();
            fileOutputStream.close();
            ResponseBuilder response = Response.ok((Object) file);
            response.header("Content-Disposition", "image;filename=" + fileName);
            return response.build();
        }
        return Response.status(Response.Status.NOT_FOUND).build();
    }

    protected String getFileName(MultivaluedMap<String, String> header, String id) {
        String[] contentDisposition = header.getFirst("Content-Disposition").split(";");

        for (String filename : contentDisposition) {
            if ((filename.trim().startsWith("filename"))) {
                String[] name = filename.split("=");
                String finalFileName = name[1].trim().replaceAll("\"", "");
                return finalFileName;
            }
        }
        return id; // use id instead
    }
}