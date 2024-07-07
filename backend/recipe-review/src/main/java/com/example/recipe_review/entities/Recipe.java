package com.example.recipe_review.entities;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "recipes")
public class Recipe {
    @Id
    private String id;
    private String title;
    private String url;
    private String thumbnail;

    public Recipe() {}

    public Recipe(String title, String youtubeUrl, String thumbnail) {
        this.title = title;
        this.url = youtubeUrl;
        this.thumbnail = thumbnail;
    }
}

