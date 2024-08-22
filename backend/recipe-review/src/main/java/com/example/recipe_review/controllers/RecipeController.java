package com.example.recipe_review.controllers;

import com.example.recipe_review.entities.Recipe;
import com.example.recipe_review.services.RecipeService;
import com.example.recipe_review.services.YoutubeService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private final RecipeService recipeService;
    private final YoutubeService youtubeService;

    @Autowired
    public RecipeController(RecipeService recipeService, YoutubeService youtubeService) {
        this.recipeService = recipeService;
        this.youtubeService = youtubeService;
    }

    @PostMapping("/saveFromYoutube")
    public ResponseEntity<Recipe> saveYoutubeVideoAsRecipe(@RequestParam String videoId) {
        Map<String, Object> videoDetails = youtubeService.getVideoDetails(videoId);
        Recipe recipe =  recipeService.saveYoutubeVideoAsRecipe(videoDetails, videoId);
        return ResponseEntity.ok(recipe);
    }

    @GetMapping("/search")
    public ResponseEntity<Map<String, Object>> searchRecipes(@RequestParam String query, @RequestParam(defaultValue = "10") int maxResults) {
        System.out.println(query);
        Map searchResults = youtubeService.searchRecipes(query, maxResults);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping
    public ResponseEntity<List<Recipe>> getAllRecipes() {
        return new ResponseEntity<>(this.recipeService.getAllRecipes(), HttpStatus.OK);
    }

    @GetMapping("/{videoId}")
    public ResponseEntity<Optional<Recipe>> getRecipeByVideoId(@PathVariable String videoId) {
        Optional<Recipe> recipe = recipeService.getRecipeByVideoId(videoId);
        return new ResponseEntity<>(recipe, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Recipe> addRecipe(@RequestBody Recipe recipe) {
        Recipe createdRecipe = this.recipeService.createRecipe(recipe);
        return new ResponseEntity<>(createdRecipe, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable String id) {
        this.recipeService.deleteRecipe(id);
        return ResponseEntity.noContent().build();
    }
}
