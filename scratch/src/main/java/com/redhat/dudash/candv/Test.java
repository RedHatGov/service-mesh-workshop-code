package com.redhat.dudash.candv;

import java.lang.String;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/test")
public interface Test {
  /**
   * testing get
   */
  @GET
  @Produces("application/json")
  @Consumes("application/json")
  String generatedMethod6();
}
