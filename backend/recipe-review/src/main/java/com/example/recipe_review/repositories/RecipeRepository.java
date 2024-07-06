package com.example.recipe_review.repositories;

import com.example.recipe_review.entities.Recipe;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecipeRepository extends MongoRepository<Recipe, String> {

}
