package com.example.recipe_review.services;

import com.example.recipe_review.entities.Recipe;
import com.example.recipe_review.repositories.RecipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecipeService {
    private final RecipeRepository recipeRepository;

    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public List<Recipe> getAllRecipes() {
        return this.recipeRepository.findAll();
    }

    public Optional<Recipe> findRecipeById(String id) {
        return this.recipeRepository.findById(id);
    }

    public Recipe createRecipe(Recipe recipe) {
        return this.recipeRepository.save(recipe);
    }

    public void deleteRecipe(String id) {
        this.recipeRepository.deleteById(id);
    }

    public Optional<Recipe> findByYoutubeUrl(String youtubeUrl) {
        return recipeRepository.findByUrl(youtubeUrl);
    }
}
