import apiSlice from "../app/api/apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        addUser: builder.mutation({
            query: (userData) => ({
                url: '/api/users',
                method: 'POST',
                body: userData,
            }),
        }),
        deleteUser: builder.mutation({
            query: (id) => ({
                url: `/api/users/$`
            })
        })
    })
})