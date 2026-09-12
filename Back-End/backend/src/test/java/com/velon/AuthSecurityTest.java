package com.velon;

import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(classes = BackendApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class AuthSecurityTest {

    @Value("${local.server.port}")
    private int port;

    @Autowired
    private UserDAO userDAO;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setUp() {
        RestAssured.port = port;
    }

    @Test
    public void testRegisterHashesPassword() {
        String email = "reg_test_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com";
        String plainPassword = "SecretPassword123!";

        Map<String, String> regBody = new HashMap<>();
        regBody.put("name", "Register Test User");
        regBody.put("email", email);
        regBody.put("password", plainPassword);
        regBody.put("role", "USER");

        given()
                .contentType(ContentType.JSON)
                .body(regBody)
                .when()
                .post("/auth/register")
                .then()
                .statusCode(200);

        User savedUser = userDAO.findByEmail(email).orElse(null);
        org.junit.jupiter.api.Assertions.assertNotNull(savedUser);
        org.junit.jupiter.api.Assertions.assertNotEquals(plainPassword, savedUser.getPassword());
        assertTrue(passwordEncoder.matches(plainPassword, savedUser.getPassword()));
    }

    @Test
    public void testLogin_RejectsWrongPassword() {
        String email = "login_test_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com";
        String correctPassword = "CorrectPassword123!";

        Map<String, String> regBody = new HashMap<>();
        regBody.put("name", "Login Test User");
        regBody.put("email", email);
        regBody.put("password", correctPassword);
        regBody.put("role", "USER");

        given()
                .contentType(ContentType.JSON)
                .body(regBody)
                .when()
                .post("/auth/register")
                .then()
                .statusCode(200);

        // Try wrong password
        Map<String, String> wrongLogin = new HashMap<>();
        wrongLogin.put("email", email);
        wrongLogin.put("password", "TotallyWrongPassword!");

        given()
                .contentType(ContentType.JSON)
                .body(wrongLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(401);

        // Try correct password
        Map<String, String> correctLogin = new HashMap<>();
        correctLogin.put("email", email);
        correctLogin.put("password", correctPassword);

        given()
                .contentType(ContentType.JSON)
                .body(correctLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .body("token", notNullValue())
                .body("email", equalTo(email));
    }

    @Test
    public void testAdminEndpoint_AuthorizationProtection() {
        // 1. Without any token -> 401
        given()
                .contentType(ContentType.JSON)
                .body("{\"namaMobil\":\"Test Car\",\"hargaPerHari\":250000,\"kapasitas\":4}")
                .when()
                .post("/admin/cars")
                .then()
                .statusCode(401);

        // 2. Register regular USER and get token
        String userEmail = "regular_user_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com";
        Map<String, String> userReg = new HashMap<>();
        userReg.put("name", "Regular User");
        userReg.put("email", userEmail);
        userReg.put("password", "Pass123!");
        userReg.put("role", "USER");

        given().contentType(ContentType.JSON).body(userReg).when().post("/auth/register").then().statusCode(200);

        Map<String, String> userLogin = new HashMap<>();
        userLogin.put("email", userEmail);
        userLogin.put("password", "Pass123!");

        String userToken = given()
                .contentType(ContentType.JSON)
                .body(userLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract().path("token");

        // Request with USER token -> 403 Forbidden
        given()
                .header("Authorization", "Bearer " + userToken)
                .contentType(ContentType.JSON)
                .body("{\"namaMobil\":\"Test Car\",\"hargaPerHari\":250000,\"kapasitas\":4}")
                .when()
                .post("/admin/cars")
                .then()
                .statusCode(403);

        // 3. Register ADMIN and get token
        String adminEmail = "admin_user_" + UUID.randomUUID().toString().substring(0, 8) + "@velon.com";
        Map<String, String> adminReg = new HashMap<>();
        adminReg.put("name", "Admin User");
        adminReg.put("email", adminEmail);
        adminReg.put("password", "AdminPass123!");
        adminReg.put("role", "ADMIN");

        given().contentType(ContentType.JSON).body(adminReg).when().post("/auth/register").then().statusCode(200);

        Map<String, String> adminLogin = new HashMap<>();
        adminLogin.put("email", adminEmail);
        adminLogin.put("password", "AdminPass123!");

        String adminToken = given()
                .contentType(ContentType.JSON)
                .body(adminLogin)
                .when()
                .post("/auth/login")
                .then()
                .statusCode(200)
                .extract().path("token");

        // Request with ADMIN token -> 200 OK
        given()
                .header("Authorization", "Bearer " + adminToken)
                .contentType(ContentType.JSON)
                .body("{\"namaMobil\":\"Test Admin Car\",\"hargaPerHari\":250000,\"kapasitas\":4}")
                .when()
                .post("/admin/cars")
                .then()
                .statusCode(200)
                .body("namaMobil", equalTo("Test Admin Car"));
    }
}
