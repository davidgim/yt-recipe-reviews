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

    @DBRef
    private Recipe recipe;

    @DBRef
    private User user;

    public Review() {}

    public Review(String comment, int rating, Recipe recipe, User user) {
        this.comment = comment;
        this.rating = rating;
        this.recipe = recipe;
        this.user = user;
    }


    public String getComment() { return comment; }
    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getUser() {
        return user.getUsername();
    }

    public String getRecipe() {
        return recipe.getTitle();
    }

    public String getId() {
        return id;
    }
}
