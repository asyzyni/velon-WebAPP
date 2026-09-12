package com.velon.config;

import com.velon.dao.UserDAO;
import com.velon.model.entity.User;
import com.velon.service.SessionService;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    private final SessionService sessionService;
    private final UserDAO userDAO;

    public AdminAuthInterceptor(SessionService sessionService, UserDAO userDAO) {
        this.sessionService = sessionService;
        this.userDAO = userDAO;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // Allow CORS preflight requests
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        String token = extractToken(request);
        if (token == null || token.trim().isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Session token required");
            return false;
        }

        Optional<Integer> userIdOpt = sessionService.getUserIdByToken(token);
        if (!userIdOpt.isPresent()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: Invalid or expired session");
            return false;
        }

        Integer userId = userIdOpt.get();
        Optional<User> userOpt = userDAO.findById(userId);
        if (!userOpt.isPresent()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: User not found");
            return false;
        }

        User user = userOpt.get();
        if (user.getRole() == null || !"ADMIN".equalsIgnoreCase(user.getRole().trim())) {
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write("Forbidden: Admin privileges required");
            return false;
        }

        return true;
    }

    private String extractToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        String customHeader = request.getHeader("X-Session-Token");
        if (customHeader != null && !customHeader.trim().isEmpty()) {
            return customHeader.trim();
        }
        return null;
    }
}
