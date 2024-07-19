import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials, logOut } from '../../features/auth/authSlice';

const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:8080',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 403) {
        const refreshToken = api.getState().auth.refreshToken;
        const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
        console.log('Made request and this is hte result: ' + refreshResult);
        if (refreshResult.data) {
            const user = api.getState().auth.user;
            api.dispatch(setCredentials({ token: refreshResult.data.token, refreshToken, user }));
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
        
    }

    return result;

}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})

export default apiSlice;