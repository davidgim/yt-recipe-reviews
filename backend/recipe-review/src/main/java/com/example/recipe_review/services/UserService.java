package com.example.recipe_review.services;

import com.example.recipe_review.config.RegistrationError;
import com.example.recipe_review.entities.User;
import com.example.recipe_review.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> getUserById(String id) {
        return userRepository.findById(id);
    }

    public Optional<Object> registerUser(User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return Optional.of(new RegistrationError("username", "Username cannot be empty"));
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return Optional.of(new RegistrationError("email", "Email cannot be empty"));
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }
        if (userRepository.findByUsername(user.getUsername()) != null) {
            return Optional.of(new RegistrationError("username", "Username is already taken"));
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return Optional.of(new RegistrationError("email", "Email is already in use"));
        }
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = userRepository.save(user);
        return Optional.of(savedUser);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }
        return user;
    }

    public Optional<User> updateUser(String id, User userUpdates) {
        return userRepository.findById(id).map(user -> {
            if (userUpdates.getUsername() != null && !userUpdates.getUsername().isEmpty()) {
                user.setUsername(userUpdates.getUsername());
            }
            if (userUpdates.getEmail() != null && !userUpdates.getEmail().isEmpty()) {
                user.setEmail(userUpdates.getEmail());
            }
            if (userUpdates.getPassword() != null && !userUpdates.getPassword().isEmpty()) {
                user.setEmail(userUpdates.getPassword());
            }
            return userRepository.save(user);
        });
    }

    public boolean deleteUser(String id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }

    public Optional<User> saveRecipe(String userId, String recipeId) {
        return userRepository.findById(userId).map(user -> {
            if (!user.getSavedRecipeIds().contains(recipeId)) {
                user.getSavedRecipeIds().add(recipeId);
                userRepository.save(user);
            }
            return user;
        });
    }

    public Optional<User> removeUser(String userId, String recipeId) {
        return userRepository.findById(userId).map(user -> {
            if (user.getSavedRecipeIds().contains(recipeId)) {
                user.getSavedRecipeIds().remove(recipeId);
                userRepository.save(user);
            }
            return user;
        });
    }

    public List<String> getSavedRecipes(String userId) {
        return userRepository.findById(userId).map(User::getSavedRecipeIds).orElse(null);
    }
}
