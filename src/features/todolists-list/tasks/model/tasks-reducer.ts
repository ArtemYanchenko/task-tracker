import { TasksStateType } from "features/todolists-list/tasks/ui/task";
import { StatusesType } from "app/model/app-reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { todolistsThunks } from "features/todolists-list/todolists/model/todolist-reducer";
import { createAppAsyncThunk } from "common/utils/create-app-async-thunk";
import { tasksApi } from "features/todolists-list/tasks/api/tasks.api";
import { TaskType, UpdateTaskModelApiType } from "features/todolists-list/tasks/api/tasks.api.types";
import { ResultCode, TaskPriorities, TaskStatuses } from "common/enums";

const tasksInitialState: TasksStateType = {};

const slice = createSlice({
  name: "tasks",
  initialState: tasksInitialState,
  reducers: {
    changeTaskEntityStatus(
      state,
      action: PayloadAction<{
        todolistId: string;
        taskId: string;
        entityStatus: StatusesType;
      }>,
    ) {
      let tasks = state[action.payload.todolistId];
      const index = tasks.findIndex((todo) => todo.id === action.payload.taskId);
      if (index !== -1) tasks[index] = { ...tasks[index], entityStatus: action.payload.entityStatus };
    },
    removeTasksAfterLogout(state) {
      state = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state[action.payload.todolistId] = action.payload.tasks.map((el) => ({ ...el, entityStatus: "idle" }));
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state[action.payload.task.todoListId].unshift(action.payload.task);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        let tasks = state[action.payload.todolistId];
        const index = tasks.findIndex((todo) => todo.id === action.payload.taskId);
        if (index !== -1) tasks[index] = { ...tasks[index], ...action.payload.model };
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state[action.payload.todolistId] = state[action.payload.todolistId].filter((el) => el.id !== action.payload.taskId);
      })
      .addCase(todolistsThunks.addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = [];
      })
      .addCase(todolistsThunks.removeTodolist.fulfilled, (state, action) => {
        delete state[action.payload.todolistId];
      })
      .addCase(todolistsThunks.getTodolists.fulfilled, (state, action) => {
        action.payload.todolists.forEach((el) => {
          state[el.id] = [];
        });
      });
  },
});

//thunks
export const fetchTasks = createAppAsyncThunk<
  {
    tasks: TaskType[];
    todolistId: string;
  },
  string
>("tasks/fetchTasks", async (todolistId) => {
  const res = await tasksApi.getTasks(todolistId);
  const tasks = res.data.items;
  return { tasks, todolistId };
});

export const addTask = createAppAsyncThunk<
  {
    task: TaskType;
  },
  AddTaskArgType
>("tasks/addTask", async (arg, { rejectWithValue }) => {
  const res = await tasksApi.addTask(arg);
  if (res.data.resultCode === ResultCode.Success) {
    const task = res.data.data.item;
    return { task };
  } else {
    return rejectWithValue({ data: res.data, showGlobalError: false });
  }
});

export const updateTask = createAppAsyncThunk<UpdateTaskArgType, UpdateTaskArgType>("tasks/updateTask", async (arg, { dispatch, rejectWithValue, getState }) => {
  const task = getState().tasks[arg.todolistId].filter((el) => el.id === arg.taskId)[0];
  const apiModel: UpdateTaskModelApiType = {
    priority: task.priority,
    deadline: task.deadline,
    startDate: task.startDate,
    description: task.description,
    status: task.status,
    title: task.title,
    ...arg.model,
  };
  dispatch(
    tasksActions.changeTaskEntityStatus({
      todolistId: arg.todolistId,
      taskId: arg.taskId,
      entityStatus: "loading",
    }),
  );
  const res = await tasksApi.updateTask(arg.todolistId, arg.taskId, { ...apiModel });
  if (res.data.resultCode === ResultCode.Success) {
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "idle",
      }),
    );
    return arg;
  } else {
    return rejectWithValue(null);
  }
});

export const removeTask = createAppAsyncThunk<any, RemoveTaskArgType>("tasks/removeTask", async (arg, { dispatch, rejectWithValue }) => {
  dispatch(
    tasksActions.changeTaskEntityStatus({
      todolistId: arg.todolistId,
      taskId: arg.taskId,
      entityStatus: "loading",
    }),
  );
  const res = await tasksApi.removeTask(arg.todolistId, arg.taskId);
  if (res.data.resultCode === ResultCode.Success) {
    dispatch(
      tasksActions.changeTaskEntityStatus({
        todolistId: arg.todolistId,
        taskId: arg.taskId,
        entityStatus: "idle",
      }),
    );
    return arg;
  } else {
    return rejectWithValue(null);
  }
});

export const tasksReducer = slice.reducer;
export const tasksActions = slice.actions;
export const tasksThunks = { fetchTasks, addTask, updateTask, removeTask };

// types
export type UpdateTaskModelType = {
  title?: string;
  description?: string;
  status?: TaskStatuses;
  priority?: TaskPriorities;
  startDate?: string;
  deadline?: string;
};

export type AddTaskArgType = {
  todolistId: string;
  title: string;
};

type UpdateTaskArgType = { todolistId: string; taskId: string; model: UpdateTaskModelType };
type RemoveTaskArgType = { todolistId: string; taskId: string };
