/**
 * User Profile Service Test
 * Created by: Gbenga Taylor
 * https://github.com/gbengataylor
 * 
 * (C) 2019
 * Released under the terms of Apache-2.0 License
 */

 // TODO: fix tests
package org.microservices.demo.service;

import io.quarkus.test.junit.QuarkusTest;
import org.junit.jupiter.api.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

@QuarkusTest
public class UserProfileServiceTest {

   // @Test
    public void testHelloEndpoint() {
        given()
          .when().get("/users")
          .then()
             .statusCode(200)
             .body(is("hello"));
    }

}