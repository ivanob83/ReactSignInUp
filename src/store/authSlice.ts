import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    uid: string | null;
    email: string | null;
    token: string | null;
    isLoggedIn: boolean;
}

const initialState: UserState = {
    uid: null,
    email: null,
    token: null,
    isLoggedIn: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser(
            state,
            action: PayloadAction<{ uid: string; email: string; token: string }>
        ) {
            state.uid = action.payload.uid;
            state.email = action.payload.email;
            state.token = action.payload.token;
            state.isLoggedIn = true;
        },
        clearUser(state) {
            state.uid = null;
            state.email = null;
            state.token = null;
            state.isLoggedIn = false;
        },
    },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
