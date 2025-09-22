// store/userSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  username: string | null;
  role: "teacher" | "student" | null;
}

const initialState: UserState = {
  username: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.role = action.payload.role;

      sessionStorage.setItem("pollUser", JSON.stringify(action.payload));
    },
    loadUserFromSession: (state) => {
      const stored = sessionStorage.getItem("pollUser");
      if (stored) {
        const parsed = JSON.parse(stored);
        state.username = parsed.username;
        state.role = parsed.role;
      }
    },
    clearUser: (state) => {
      state.username = null;
      state.role = null;
      sessionStorage.removeItem("pollUser");
    },
  },
});

export const { setUser, loadUserFromSession, clearUser } = userSlice.actions;
export default userSlice.reducer;
