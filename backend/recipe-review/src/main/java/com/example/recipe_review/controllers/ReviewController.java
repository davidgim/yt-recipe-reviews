package com.example.recipe_review.controllers;

import com.example.recipe_review.entities.Review;
import com.example.recipe_review.entities.User;
import com.example.recipe_review.services.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService reviewService;

    @Autowired
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/{recipeId}")
    public ResponseEntity<List<Review>> getReviewsByRecipeId(@PathVariable String recipeId) {
        List<Review> reviews = reviewService.getReviewsByRecipeId(recipeId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User authenticatedUser = (User) authentication.getPrincipal();
        System.out.println(review.getRecipe());
        review.setUser(authenticatedUser);
        Review savedReview = reviewService.addReview(review);

        System.out.println(savedReview.getComment());
        System.out.println(savedReview.getUser());
        return ResponseEntity.ok(savedReview);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.noContent().build();
    }


}
