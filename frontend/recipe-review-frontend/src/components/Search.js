import React, { useState } from 'react'
import { useLazySearchVideosQuery } from '../features/recipes/recipesApiSlice'
import { useNavigate } from 'react-router-dom'
import '../styles/components.css'
import { ClipLoader } from 'react-spinners'

const Search = () => {
    const [query, setQuery] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [triggerSearch, { data, error, isLoading }] = useLazySearchVideosQuery();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            triggerSearch(query);
            setHasSearched(true);
        }
    };

    const handleClick = (videoId) => {
        navigate(`/loggedin/recipe/${videoId}`);
    };

    return (
        <div className="search-container">
            <div className="search-hero">
                <h1>Discover Amazing Recipe Videos</h1>
                <p>Search through thousands of cooking videos and save your favorites</p>
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        className="search-input"
                        type='text'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder='Try "easy pasta recipes" or "healthy breakfast"'
                    />
                    <button className="search-button" type='submit'>
                        Search Recipes
                    </button>
                </form>
            </div>

            {isLoading && (
                <div className="loading-spinner">
                    <ClipLoader color="#ff6b6b" size={50} />
                </div>
            )}
            
            {error && (
                <div className="error-message">
                    <p>Error: {error.message}</p>
                </div>
            )}

            {data && data.items && (
                <div className="recipe-grid">
                    {data.items.map((item) => (
                        <div key={item.id.videoId} className="recipe-card">
                            <img 
                                className="recipe-thumbnail"
                                src={item.snippet.thumbnails.medium.url} 
                                alt={item.snippet.title}
                            />
                            <div className="recipe-content">
                                <h3 className="recipe-title">{item.snippet.title}</h3>
                                <p className="recipe-description">{item.snippet.description}</p>
                                <button 
                                    className="view-recipe-button"
                                    onClick={() => handleClick(item.id.videoId)}
                                >
                                    View Recipe
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {hasSearched && !isLoading && !error && (!data || !data.items || data.items.length === 0) && (
                <div className="no-results">
                    <h2>No recipes found</h2>
                    <p>Try adjusting your search terms or try a different query</p>
                </div>
            )}
        </div>
    )
}

export default Search