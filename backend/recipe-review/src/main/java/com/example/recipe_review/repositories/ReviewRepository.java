package com.example.recipe_review.repositories;

import com.example.recipe_review.entities.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByRecipeId(String recipeId);
}
