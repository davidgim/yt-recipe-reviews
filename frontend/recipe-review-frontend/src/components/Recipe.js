import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetRecipeByVideoIdQuery, useSaveRecipeFromYoutubeMutation } from '../features/recipes/recipesApiSlice'
import { useGetReviewsByRecipeIdQuery, useAddReviewMutation } from '../features/reviews/reviewsApiSlice'
import { selectCurrentUser } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'
import { ClipLoader } from 'react-spinners'

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
    
    const [saveRecipeFromYoutube, { isLoading: isSaveLoading }] = useSaveRecipeFromYoutubeMutation();
    const { data: reviews, error: reviewsError, isLoading: reviewsLoading, refetch: refetchReviews} = useGetReviewsByRecipeIdQuery(recipeId, {
        skip: !recipeId,
    });
    const [addReview] = useAddReviewMutation();

    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        if (!recipe && !recipeLoading && !isSaveLoading) {
            saveRecipeFromYoutube(videoId)
                .unwrap()
                .then(() => {
                    setShouldRefetch(true);
                    refetchRecipe();
                })
                .finally(() => {
                    setShouldRefetch(false);
                });
        }
    }, [videoId, recipe, recipeLoading, isSaveLoading, saveRecipeFromYoutube, refetchRecipe]);

    const handleAddReview = async (e) => {
        e.preventDefault();
        const comment = e.target.elements.content.value;
        const rating = parseInt(e.target.elements.rating.value);
        const newReview = { comment, rating, recipe: { id: recipeId } };

        try {
            await addReview(newReview).unwrap();
            e.target.reset();
            refetchReviews();
        } catch (err) {
        }
    };

    const renderStars = (rating) => {
        return '★'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    if (recipeLoading) {
        return (
            <div className="loading-spinner">
                <ClipLoader color="#ff6b6b" size={50} />
            </div>
        );
    }

    if (recipeError) {
        return (
            <div className="error-message">
                <p>Error loading recipe. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="recipe-details">
            {recipe && (
                <>
                    <h2>{recipe.title}</h2>
                    <p>{recipe.description}</p>
                    <div className="video-container">
                        <iframe
                            src={`https://www.youtube.com/embed/${recipe.videoId}`}
                            title="Youtube Video Player"
                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    
                    <div className="reviews-section">
                        <h3>Reviews</h3>
                        {reviewsLoading ? (
                            <div className="loading-spinner">
                                <ClipLoader color="#ff6b6b" size={30} />
                            </div>
                        ) : reviewsError ? (
                            <div className="error-message">
                                <p>Error loading reviews. Please try again later.</p>
                            </div>
                        ) : (
                            <div className="reviews-list">
                                {reviews && reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="review-card">
                                            <p className="review-content">{review.comment}</p>
                                            <div className="review-meta">
                                                <span className="rating-stars">{renderStars(review.rating)}</span>
                                                <span>By: {review.user}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No reviews yet. Be the first to review!</p>
                                )}
                            </div>
                        )}

                        {currentUser && (
                            <div className="add-review-form">
                                <h4>Add Your Review</h4>
                                <form onSubmit={handleAddReview}>
                                    <textarea 
                                        name="content" 
                                        placeholder="Share your experience with this recipe..." 
                                        required
                                    ></textarea>
                                    <div className="rating-input">
                                        <label htmlFor="rating">Rating (1-5):</label>
                                        <input 
                                            type="number" 
                                            name="rating" 
                                            id="rating"
                                            min="1" 
                                            max="5" 
                                            required 
                                        />
                                    </div>
                                    <button type="submit" className="submit-review-button">
                                        Submit Review
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Recipe;