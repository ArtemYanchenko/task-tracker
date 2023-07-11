import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const appInitialState = {
  status: "idle" as StatusesType,
  error: null as string | null,
  isInitialized: false as boolean,
};

const slice = createSlice({
  name: "app",
  initialState: appInitialState,
  reducers: {
    setStatus(state, action: PayloadAction<{ status: StatusesType }>) {
      state.status = action.payload.status;
    },
    setError(state, action: PayloadAction<{ error: string | null }>) {
      state.error = action.payload.error;
    },
    setIsInitialized(state, action: PayloadAction<{ isInitialized: boolean }>) {
      state.isInitialized = action.payload.isInitialized;
    },
  },
});

export const appReducer = slice.reducer;
export const appActions = slice.actions;

//types
export type StatusesType = "idle" | "loading" | "succeeded" | "failed";
export type AppInitialStateType = typeof appInitialState;
