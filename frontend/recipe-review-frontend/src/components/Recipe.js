import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetRecipeByVideoIdQuery, useSaveRecipeFromYoutubeMutation } from '../features/recipes/recipesApiSlice'
import { useGetReviewsByRecipeIdQuery, useAddReviewMutation } from '../features/reviews/reviewsApiSlice'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'

const Recipe = () => {
    const { videoId } = useParams();
    const [shouldRefetch, setShouldRefetch] = useState(false); 
    const { data: recipe, error: recipeError, isLoading: recipeLoading, refetch: refetchRecipe } = useGetRecipeByVideoIdQuery(videoId, {
            skip: shouldRefetch
    });

    const [recipeId, setRecipeId] = useState(null);

    useEffect(() => {
        if (recipe && recipe.id) {
            setRecipeId(recipe.id);
        }
    }, [recipe]);
    const [saveRecipeFromYoutube, { data: savedRecipe, error: saveError, isLoading: isSaveLoading}] = useSaveRecipeFromYoutubeMutation();
    const { data: reviews, error: reviewsError, isLoading: reviewsLoading, refetch: refetchReviews} = useGetReviewsByRecipeIdQuery(recipeId, {
        skip: !recipeId,
    });
    const [addReview] = useAddReviewMutation();

    const currentUser = useSelector(selectCurrentUser);
    console.log(currentUser);
 

    useEffect(() => {
        if (!recipe && !recipeLoading && !isSaveLoading) {
            saveRecipeFromYoutube(videoId)
                .unwrap()
                .then(() => {
                    setShouldRefetch(true); // Indicate that we need to refetch
                    refetchRecipe(); // Trigger refetch
                })
                .finally(() => {
                    setShouldRefetch(false); // Reset the flag after refetch
                });
        }
    }, [videoId, recipe, recipeLoading, isSaveLoading, saveRecipeFromYoutube, refetchRecipe]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        const comment = e.target.elements.content.value;
        const rating = e.target.elements.rating.value;
        const newReview = { comment, rating, recipe: { id: recipeId } };

        try {
            await addReview(newReview);
            alert('Review added successfully');
            refetchReviews();
        } catch (err) {
            console.error('Failed to add review', err);
        }
    };


  return (
    <div>
        {recipeLoading && <p>Loading recipe...</p>}
        {recipeError && <p>Error loading recipe...</p>}
        {recipe && (
            <div>
                <h2>{recipe.title}</h2>
                <p>{recipe.description}</p>
                <div className='video-container'>
                    <iframe
                        width="560"
                        height="315"
                        src={`https://www.youtube.com/embed/${recipe.videoId}`}
                        title="Youtube Video Player"
                        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
                <h3>Reviews</h3>
                {reviewsLoading && <p>Loading reviews...</p>}
                {reviewsError && <p>Error loading reviews...</p>}
                {reviews && reviews.map((review) => (
                    <div key={review.id}>
                        <p>{review.comment}</p>
                        <p>Rating: {review.rating}</p>
                        <p>By: {review.user}</p>
                    </div>
                ))}
                {currentUser && 
                    <form onSubmit={handleAddReview}>
                        <textarea name='content' placeholder='Write your review' required></textarea>
                        <input type='number' name="rating" min={1} max={5} required />
                        <button type='submit'>Add review</button>
                    </form>
                }

            </div>
        )}
    </div>
  )
}

export default Recipe