import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { checkAuthService, logoutService } from "../../auth/authServices.ts";

const getUserFromStorage = () => {
    try {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    } catch {
        return null;
    }
};
interface AuthState {
    user: any;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: getUserFromStorage(),
    loading: getUserFromStorage() ? false : true,
    error: null,
};



// CHECK AUTH THUNK (/api/auth/me)
export const checkAuthThunk = createAsyncThunk<
    any,
    void,
    { rejectValue: string }
>(
    "auth/checkAuth",
    async (_, { rejectWithValue }) => {
        try {
            return await checkAuthService();
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Auth check failed"
            );
        }
    }
);



// LOGOUT THUNK (/api/auth/logout)
export const logoutThunk = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            return await logoutService();
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Logout failed"
            );
        }
    }
);



const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder

            // CHECK AUTH
            .addCase(checkAuthThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuthThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.error = null;
                // Save to localStorage
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(checkAuthThunk.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload ?? "Something went wrong";
                localStorage.removeItem('user');
            })


            // LOGOUT
            .addCase(logoutThunk.fulfilled, (state) => {
                state.user = null;
                // Clear localStorage on logout
                localStorage.removeItem('user');
            });
    },
});

export default authSlice.reducer;
