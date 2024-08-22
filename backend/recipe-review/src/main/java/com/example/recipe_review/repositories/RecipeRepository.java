package com.example.recipe_review.repositories;

import com.example.recipe_review.entities.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RecipeRepository extends MongoRepository<Recipe, String> {
    Optional<Recipe> findByVideoId(String videoId);
}
