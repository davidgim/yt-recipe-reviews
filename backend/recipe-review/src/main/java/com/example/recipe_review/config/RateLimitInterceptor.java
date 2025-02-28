package com.example.recipe_review.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class RateLimitInterceptor implements HandlerInterceptor {
    private final Map<String, Integer> requestCounts = new ConcurrentHashMap<>();
    private final Map<String, Long> lastResetTime = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS = 100;
    private static final int WINDOW_MINUTES = 1;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String clientId = request.getRemoteAddr();
        long currentTime = System.currentTimeMillis();
        long lastReset = lastResetTime.getOrDefault(clientId, 0L);

        if (currentTime - lastReset > WINDOW_MINUTES * 60 * 1000) {
            requestCounts.put(clientId, 1);
            lastResetTime.put(clientId, currentTime);
            return true;
        }

        int requestCount = requestCounts.getOrDefault(clientId, 0) + 1;
        if (requestCount > MAX_REQUESTS) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            return false;
        }

        requestCounts.put(clientId, requestCount);
        return true;
    }
} 