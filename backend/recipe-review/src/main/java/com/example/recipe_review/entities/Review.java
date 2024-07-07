package com.example.recipe_review.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "reviews")
public class Review {
    @Id
    private String id;
    private String comment;
    private int rating;

    public Review() {}

    public Review(String comment, int rating, Recipe recipe, User user) {
        this.comment = comment;
        this.rating = rating;
        this.recipe = recipe;
        this.user = user;
    }

    @DBRef
    private Recipe recipe;

    @DBRef
    private User user;


}
