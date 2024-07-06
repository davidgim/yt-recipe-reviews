package com.example.recipe_review.config;

import com.example.recipe_review.services.UserService;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfiguration;

public class WebSecurityConfig extends WebSecurityConfiguration {
    private final UserService userService;
    private final JwtRequestFilter


}
