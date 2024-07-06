package com.example.recipe_review.services;

import com.example.recipe_review.entities.Review;
import com.example.recipe_review.repositories.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public List<Review> getReviewsByRecipeId(String recipeId) {
        return this.reviewRepository.findByRecipeId(recipeId);
    }

    public Review addReview(Review review) {
        return this.reviewRepository.save(review);
    }

    public void deleteReview(String recipeId) {
        this.reviewRepository.deleteById(recipeId);
    }


}
