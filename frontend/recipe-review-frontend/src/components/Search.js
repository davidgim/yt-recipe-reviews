import React, { useState } from 'react'
import { useLazySearchVideosQuery } from '../features/recipes/recipesApiSlice'
import { Link, useNavigate } from 'react-router-dom'

const Search = () => {
    const [query, setQuery] = useState('');
    const [triggerSearch, { data, error, isLoading }] = useLazySearchVideosQuery();
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        triggerSearch(query);
    };

    const handleClick = (videoId) => {
        navigate(`/loggedin/recipe/${videoId}`);
    };

  return (
    <div>
        <form onSubmit={handleSearch}>
            <input
                type='text'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Search for video recipes'
            />
            <button type='submit'>Search</button>
        </form>
        
        {isLoading && <p>Loading...</p>}
        {error && <p>Error: {error.message}</p>}
        {data && data.items && (
            <div> 
                {data.items.map((item) => (
                    <div key={item.id.videoId}>
                        <h3>{item.snippet.title}</h3>
                        <p>{item.snippet.description}</p>
                        <img src={item.snippet.thumbnails.default.url} alt={item.snippet.title} />
                        <button onClick={() => handleClick(item.id.videoId)}>View Recipe</button>
                    </div>
                ))}
            </div>
            
        )}
    </div>
  )
}

export default Search