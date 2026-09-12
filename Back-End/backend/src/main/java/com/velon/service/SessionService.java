package com.velon.service;

import com.velon.model.entity.User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class SessionService {

    private final Map<String, Integer> tokenToUserId = new ConcurrentHashMap<>();

    public String createSession(User user) {
        String token = UUID.randomUUID().toString();
        tokenToUserId.put(token, user.getId());
        return token;
    }

    public Optional<Integer> getUserIdByToken(String token) {
        if (token == null || token.trim().isEmpty()) {
            return Optional.empty();
        }
        return Optional.ofNullable(tokenToUserId.get(token));
    }

    public void invalidateSession(String token) {
        if (token != null) {
            tokenToUserId.remove(token);
        }
    }
}
