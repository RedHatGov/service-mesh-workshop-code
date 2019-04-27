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
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
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
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;
import org.microservices.demo.json.UserProfile;
import org.microservices.demo.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

// using JAX-RS
@Path("/users")
// @Produces(MediaType.APPLICATION_JSON)
// @Consumes(MediaType.APPLICATION_JSON)
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
    @Produces(MediaType.APPLICATION_JSON)
    // @Consumes(MediaType.APPLICATION_JSON)
    public Set<UserProfile> getProfiles() {
        return userProfileService.getProfiles();
        // if had return Response.ok(profiles).build(), would require
        // @RegisterForReflection on the bean
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response createProfile(@Valid @NotNull UserProfile profile) {
        return userProfileService.createProfile(profile) ? Response.status(Response.Status.CREATED).build()
                : Response.status(Response.Status.BAD_REQUEST).build();
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    // @Consumes(MediaType.APPLICATION_JSON)
    public Response getProfile(@PathParam("id") String id) {
        UserProfile profile = userProfileService.getProfile(id);
        Response.Status status = (profile != null) ? Response.Status.OK : Response.Status.NOT_FOUND;
        return Response.status(status).entity(profile).build();
    }

    @PUT
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updateProfile(@Valid @NotNull UserProfile profile, @PathParam("id") String id) {
        // does it exist
        return userProfileService.updateProfile(profile, id) ? Response.status(Response.Status.NO_CONTENT).build()
                : Response.status(Response.Status.BAD_REQUEST).build();
    }

// hat tip  - http://www.mastertheboss.com/jboss-frameworks/resteasy/using-rest-services-to-manage-download-and-upload-of-files
    @POST
    @Path("/{id}/photo")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    // TODO -- better IO Exception handling
    public Response uploadPhoto(MultipartFormDataInput input, @PathParam("id") String id)  throws IOException {

        Map<String, List<InputPart>> uploadForm = input.getFormDataMap();
 
        // Get file data to save
        List<InputPart> inputParts = uploadForm.get("image");
        System.out.println("numer of parts " + inputParts.size());

        // extract image bytes from the stream
        for (InputPart inputPart : inputParts) {
                MultivaluedMap<String, String> header = inputPart.getHeaders();
                String fileName = getFileName(header, id);
                System.out.println("filename " + fileName);
                // convert the uploaded file to inputstream
                InputStream inputStream = inputPart.getBody(InputStream.class, null);
 
                byte[] bytes = IOUtils.toByteArray(inputStream);

                // this is for testing - remove later
                File file = new File("/home/adtaylor/labs/images/" + fileName); 
                FileOutputStream out = new FileOutputStream(file);
                out.write(bytes);
                out.flush();
                out.close();
                System.out.println(encodeFileToBase64Binary(bytes));
        }      
        // add data structure that has the id, bytes, filename..the data structure should validated that non are null, call bytes - photo
        //boolean savePhoto(id, bytes, filename); // service class .. return result based on that
        return //userProfileService.savePhoto(id, bytes, filename) ?
        Response.status(Response.Status.CREATED).build();
        //Response.status(Response.Status.BAD_REQUEST).build(); 
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

    @GET
    @Path("/{id}/photo")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
        // TODO -- better IO Exception handling

    public Response downloadPhoto(@PathParam("id") String id) throws IOException {
       // UserProfile profile = userProfileService.getProfile(id);
        //Response.Status status = (profile != null) ? Response.Status.OK : Response.Status.NOT_FOUND;
        File file = new File("/home/adtaylor/Pictures/gbenga.png"); 
      //  InputStream inputStream = new FileInputStream(file);
 
        // testing
      //  byte[] bytes = IOUtils.toByteArray(inputStream);

        // userProfileService.getPhoto(id); // return bytes and filename..internal code will
        // add an abstract user profile class that calls the ImageProcessor class
        // then write the bytes to a local file, return the file

        // this is for testing - remove later

        // TODO: if bytes or file is null remove
        // we need a temp file
        ResponseBuilder response = Response.ok((Object) file);
        response.header("Content-Disposition", "file;filename=" + file); // this should be the filename from the data structure
        return response.build();
        
    }      


 
    // move these two methods to the new ImageProcessor class
    protected static String encodeFileToBase64Binary(File file) throws IOException {
        FileInputStream fileInputStreamReader = new FileInputStream(file);
        byte[] bytes = new byte[(int)file.length()];
        fileInputStreamReader.read(bytes);
        fileInputStreamReader.close();
            
        return encodeFileToBase64Binary(bytes);
    }

    protected static String encodeFileToBase64Binary(byte[] bytes) {
       return Base64.getEncoder().encodeToString(bytes);
    }

    //TODO:
    /*
         Update OpenAPI yaml

        datastructure - UserProfilePhoto - id, bytes[] image, filename
        abstract class to upload and download (or just make the method not supported in in-memory impl)
            - abstract findUser method
            - code to call ImageProcessor to encode/decode the bytes
            - code to "save" the image..abstract method

        ImageProcessor
         - encode, decode to base64

         Update REadme with examples on how to upload and download images

         TEST native on OCP
    */
}