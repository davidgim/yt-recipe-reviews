package com.example.recipe_review.controllers;

import com.example.recipe_review.dto.AuthRequest;
import com.example.recipe_review.entities.Recipe;
import com.example.recipe_review.entities.User;
import com.example.recipe_review.services.UserService;
import com.example.recipe_review.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.tomcat.util.net.openssl.ciphers.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UserService userService;

    private final JwtUtil jwtUtil;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {
        User registeredUser = userService.registerUser(user);
        return new ResponseEntity<>(registeredUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> createAuthenticationToken(@RequestBody AuthRequest authRequest,
                                                                         HttpServletResponse response) throws AuthenticationException {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(authRequest.getUsername(), authRequest.getPassword())
        );
        final UserDetails userDetails = userService.loadUserByUsername(authRequest.getUsername());
        final String jwt = jwtUtil.generateAccessToken(userDetails);
        final String refreshToken = jwtUtil.generateRefreshToken(userDetails);
        String cookieValue = "refreshToken=" + refreshToken + "; HttpOnly; Path=/; Max-Age=604800; SameSite=None; Secure";
        response.addHeader("Set-Cookie", cookieValue);

        response.setHeader("X-Debug-Header", "Refresh successful");
        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("token", jwt);
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("username", userDetails.getUsername());
        userMap.put("email", userService.loadUserByUsername(userDetails.getUsername()));
        responseBody.put("user", userMap);

        return ResponseEntity.ok(responseBody);
    }

    @GetMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(403).body("Refresh token is missing");
        }

        UserDetails userDetails = userService.loadUserByUsername(jwtUtil.extractUsername(refreshToken, true));

        if (jwtUtil.validateToken(refreshToken, userDetails, true)) {
            String newToken = jwtUtil.generateAccessToken(userDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("token", newToken);
            response.put("refreshToken", refreshToken);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(403).body("Invalid refresh token");
        }
    }
}
