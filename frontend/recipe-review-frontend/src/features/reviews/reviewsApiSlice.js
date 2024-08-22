import apiSlice from "../../app/api/apiSlice";

export const reviewApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getReviewsByRecipeId: builder.query({
            query: (recipeId) => `/reviews/${recipeId}`,
        }),
        addReview: builder.mutation({
            query: (review) => ({
                url: `/reviews`,
                method: 'POST',
                body: review
            })
        })
    })
});

export const {
    useGetReviewsByRecipeIdQuery,
    useAddReviewMutation,
} = reviewApiSlice;