import apiSlice from "../../app/api/apiSlice";
import { setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: 'auth/login',
                method: 'POST',
                body: credentials,
            })
        }),
        register: builder.mutation({
            query: (user) => ({
                url: 'auth/register',
                method: 'POST',
                body: user,
            })
        }),
        refresh: builder.mutation({
            query: () => ({
                url: '/auth/refresh',
                method: 'GET',
            
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    console.log(data);
                    const { token: accessToken } = data;
                    dispatch(setCredentials({ token: accessToken }));
                } catch (err) {
                    console.log(err);
                }
            },
        })
    })
})

export const { useLoginMutation, useRegisterMutation, useRefreshMutation } = authApiSlice;