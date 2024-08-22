package com.example.recipe_review.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
public class YoutubeService {

    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate;

    @Autowired
    public YoutubeService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public Map searchRecipes(String query, int maxResults) {
        String url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/search")
                .queryParam("part", "snippet")
                .queryParam("q", query)
                .queryParam("maxResults", maxResults)
                .queryParam("type", "video")
                .queryParam("key", apiKey)
                .build()
                .encode()
                .toUriString();
        return restTemplate.getForObject(url, Map.class);
    }

    public Map<String, Object> getVideoDetails(String videoId) {
        String url = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/videos")
                .queryParam("part", "snippet")
                .queryParam("id", videoId)
                .queryParam("key", apiKey)
                .toUriString();

        Map response = restTemplate.getForObject(url, Map.class);
        return (Map<String, Object>) ((List<Map<String, Object>>) response.get("items")).get(0);
    }
}
