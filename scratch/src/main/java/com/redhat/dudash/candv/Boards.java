package com.redhat.dudash.candv;

import com.redhat.dudash.candv.beans.Item;
import java.lang.Object;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/boards")
public interface Boards {
  /**
   * Add a new board
   */
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response generatedMethod1();

  /**
   * Returns the JSON for the entire clipboard
   */
  @Path("/{boardId}")
  @GET
  @Produces("application/json")
  @Consumes("application/json")
  List<Item> generatedMethod2(@PathParam("boardId") Object boardId);

  /**
   * Add an item into this board
   */
  @Path("/{boardId}/items")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response generatedMethod3(@PathParam("boardId") Object boardId);

  /**
   * Returns the JSON for a specific item in a board
   */
  @Path("/{boardId}/items/{itemId}")
  @GET
  @Produces("application/json")
  @Consumes("application/json")
  Item generatedMethod4(@PathParam("boardId") Object boardId, @PathParam("itemId") Object itemId);

  /**
   * Removes the item from this board
   */
  @Path("/{boardId}/items/{itemId}")
  @DELETE
  @Produces("application/json")
  @Consumes("application/json")
  void generatedMethod5(@PathParam("boardId") Object boardId, @PathParam("itemId") Object itemId);
}
