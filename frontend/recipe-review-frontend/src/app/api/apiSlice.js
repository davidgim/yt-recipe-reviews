import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        headers.set('Content-Type', 'application/json');
        return headers;
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403 || result?.error?.status === 401) {
        console.log('Sending refresh token request');
        // Try to get a new token
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        
        if (refreshResult?.data) {
            console.log('Refresh token request successful');
            const user = api.getState().auth.user;
            // Store the new token
            api.dispatch(setCredentials({ 
                token: refreshResult.data.token,
                user 
            }));
            // Retry the original query with new token
            result = await baseQuery(args, api, extraOptions);
        } else {
            console.log('Refresh token request failed - logging out');
            api.dispatch(logOut());
        }
    }

    return result;
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Recipe', 'Review'],
    endpoints: builder => ({}),
    keepUnusedDataFor: process.env.NODE_ENV === 'production' ? 60 : 5
})

export default apiSlice;