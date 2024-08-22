import apiSlice from "../../app/api/apiSlice";

export const recipeApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        searchVideos: builder.query({
            query: (query) => `/recipes/search?query=${query}`
        }),
        getRecipeByVideoId: builder.query({
            query: (videoId) => `/recipes/${videoId}`
        }),
        saveRecipeFromYoutube: builder.mutation({
            query: (videoId) => ({
                url: `/recipes/saveFromYoutube`,
                method: 'POST',
                params: { videoId },
            })
        })
    })
})

export const {
    useLazySearchVideosQuery,
    useSearchVideosQuery,
    useGetRecipeByVideoIdQuery,
    useSaveRecipeFromYoutubeMutation,
} = recipeApiSlice;