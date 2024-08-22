import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name: 'auth',
    initialState: { token: null, user: null },
    reducers: {
        setCredentials: (state, { payload: { user, token } }) => {
            state.user = user;
            state.token = token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        }
    }
})

export const selectCurrentUser = (state) => state.auth.user;

export const selectCurrentToken = (state) => state.auth.token;

export const { setCredentials, logOut } = authSlice.actions;


export default authSlice.reducer;