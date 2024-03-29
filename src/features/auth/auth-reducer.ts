import { createSlice } from "@reduxjs/toolkit";
import { tasksActions } from "features/todolists-list/tasks/model/tasks-reducer";
import { todolistsActions } from "features/todolists-list/todolists/model/todolist-reducer";
import { createAppAsyncThunk, handleServerAppError, thunkTryCatch } from "common/utils";
import { authApi, LoginParamsType } from "features/auth/auth.api";
import { ResultCode } from "common/enums";
import { appActions } from "app/model/app-reducer";

const slice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      })
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload.isLoggedIn;
      });
  },
});

const login = createAppAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType>("auth/login", async (arg, thunkAPI) => {
  const { dispatch } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authApi.login(arg);
    if (res.data.resultCode === 0) {
      return { isLoggedIn: true };
    } else {
      const isShowAppError = !res.data.fieldsErrors.length;
      handleServerAppError(res.data, dispatch, isShowAppError);
    }
  });
});

const logout = createAppAsyncThunk<{ isLoggedIn: boolean }, void>("auth/logout", async (_, thunkAPI) => {
  const { dispatch } = thunkAPI;
  return thunkTryCatch(thunkAPI, async () => {
    const res = await authApi.logout();
    if (res.data.resultCode === 0) {
      dispatch(todolistsActions.removeTodolistsAfterLogout());
      dispatch(tasksActions.removeTasksAfterLogout());
      return { isLoggedIn: false };
    } else {
      handleServerAppError(res.data, dispatch);
    }
  });
});

const initializeApp = createAppAsyncThunk<
  {
    isLoggedIn: boolean;
  },
  any
>("auth/initializeApp", async (_, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    const res = await authApi.authMe();
    if (res.data.resultCode === ResultCode.Success) {
      return { isLoggedIn: true };
    } else {
      return rejectWithValue({ data: res.data, showGlobalError: false });
    }
  } catch (err) {
    return rejectWithValue(null);
  } finally {
    dispatch(appActions.setIsInitialized({ isInitialized: true }));
  }
});

export const authReducer = slice.reducer;
export const authThunks = { login, logout, initializeApp };
