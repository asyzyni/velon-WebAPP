package com.velon.dao;
import java.sql.PreparedStatement;

import com.velon.model.entity.User;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;


public class UserDAO {
    private static final String DB_URL = "jdbc:postgresql://localhost:5432/velon_db";
    private static final String DB_USER = "asyzyni";
    private static final String DB_PASSWORD = "Tan45is1!";

    // get connection method and other DAO methods would go here

    private Connection getConnection() throws Exception {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
    }

    // register user 

    public boolean register(User user) {
        String sql = "INSERT INTO users (name, email, password, created_at) VALUES (?,?,?,NOW())";

        try (Connection conn = getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, user.getName());
            stmt.setString(2, user.getEmail());
            stmt.setString(3, user.getPassword());

            stmt.executeUpdate();
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    // login (get user by email and password)

    public User findbyEmail(String email, String password) {
        String sql = "SELECT * FROM users WHERE email = ? AND password = ?";

        try (Connection conn = getConnection();
            PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, email);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();
            if (rs.next()) {
                User user = new User();
                user.setId(rs.getInt("id"));
                user.setName(rs.getString("name"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                user.setCreatedAt(rs.getTimestamp("created_at"));
                return user;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }
}
