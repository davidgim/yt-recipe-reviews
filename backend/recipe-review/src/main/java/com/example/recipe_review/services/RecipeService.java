package com.example.recipe_review.services;

import com.example.recipe_review.entities.Recipe;
import com.example.recipe_review.repositories.RecipeRepository;
import com.mongodb.DuplicateKeyException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalInt;

@Service
public class RecipeService {


    private final RecipeRepository recipeRepository;

    @Autowired
    public RecipeService(RecipeRepository recipeRepository) {
        this.recipeRepository = recipeRepository;
    }

    public Recipe saveYoutubeVideoAsRecipe(Map<String, Object> videoDetails, String videoId) {
        Optional<Recipe> existingRecipe = recipeRepository.findByVideoId(videoId);
        if (existingRecipe.isPresent()) {
            return existingRecipe.get();
        }
        Map<String, Object> snippet = (Map<String, Object>) videoDetails.get("snippet");
        String title = (String) snippet.get("title");
        String description = (String) snippet.get("description");

        Map<String, Object> thumbnails = (Map<String, Object>) snippet.get("thumbnails");
        Map<String, Object> defaultThumbnail = (Map<String, Object>) thumbnails.get("default");
        String thumbnailUrl = (String) defaultThumbnail.get("url");

        Recipe recipe = new Recipe(title, description, videoId, thumbnailUrl);
        return recipeRepository.save(recipe);
    }

    public List<Recipe> getAllRecipes() {
        return this.recipeRepository.findAll();
    }

    public Optional<Recipe> findRecipeById(String id) {
        return this.recipeRepository.findById(id);
    }

    public Optional<Recipe> getRecipeByVideoId(String videoId) {
        return recipeRepository.findByVideoId(videoId);
    }

    public Recipe createRecipe(Recipe recipe) {
        return this.recipeRepository.save(recipe);
    }

    public void deleteRecipe(String id) {
        this.recipeRepository.deleteById(id);
    }

}
