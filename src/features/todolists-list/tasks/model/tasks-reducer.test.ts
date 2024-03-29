import { TasksStateType } from "features/todolists-list/tasks/ui/task";
import { tasksReducer, tasksThunks } from "features/todolists-list/tasks/model/tasks-reducer";
import { todolistsThunks } from "features/todolists-list/todolists/model/todolist-reducer";
import { TaskType } from "features/todolists-list/tasks/api/tasks.api.types";

let startState: TasksStateType;

beforeEach(() => {
  startState = {
    todolistId1: [
      {
        id: "1",
        title: "RxJS",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: 0,
        priority: 1,
        startDate: "",
        deadline: "",
        addedDate: "2023-06-09T07:44:43.06",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "hello",
        description: "",
        todoListId: "todolistId1",
        order: 0,
        status: 2,
        priority: 1,
        startDate: "",
        deadline: "",
        addedDate: "2023-06-07T16:00:25.61",
        entityStatus: "idle",
      },
    ],
    todolistId2: [
      {
        id: "1",
        title: "mutability123",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: 2,
        priority: 1,
        startDate: "",
        deadline: "",
        addedDate: "2023-06-07T16:00:25.61",
        entityStatus: "idle",
      },
      {
        id: "2",
        title: "5",
        description: "",
        todoListId: "todolistId2",
        order: 0,
        status: 0,
        priority: 1,
        startDate: "",
        deadline: "",
        addedDate: "2023-06-07T16:00:25.61",
        entityStatus: "idle",
      },
    ],
  };
});

test("correct tasks should be deleted from correct array", () => {
  const args = { todolistId: "todolistId2", taskId: "2" };
  const action = tasksThunks.removeTask.fulfilled(args, "requestId", args);

  const endState = tasksReducer(startState, action);
  expect(endState["todolistId2"].length).toBe(1);
});

test("correct tasks should be added to correct array", () => {
  const task: TaskType = {
    id: "2",
    title: "juice",
    description: "",
    todoListId: "todolistId2",
    order: 0,
    status: 0,
    priority: 1,
    startDate: "",
    deadline: "",
    addedDate: "2023-06-07T16:00:25.61",
    entityStatus: "idle",
  };
  const action = tasksThunks.addTask.fulfilled(
    {
      task,
    },
    "requestId",
    { title: task.title, todolistId: task.todoListId },
  );
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId1"].length).toBe(2);
  expect(endState["todolistId2"].length).toBe(3);
  expect(endState["todolistId2"][0].id).toBeDefined();
  expect(endState["todolistId2"][0].title).toBe("juice");
});

test("status of specified tasks should be changed", () => {
  const model = {
    id: "2",
    title: "juice",
    description: "",
    todoListId: "todolistId2",
    order: 0,
    status: 2,
    priority: 1,
    startDate: "",
    deadline: "",
    addedDate: "2023-06-07T16:00:25.61",
  };
  const args = { todolistId: "todolistId2", taskId: "2", model };
  const action = tasksThunks.updateTask.fulfilled(args, "requestId", args);
  const endState = tasksReducer(startState, action);

  expect(endState["todolistId2"][1].id).toBe("2");
  expect(endState["todolistId2"][1].status).toBe(2);
  expect(endState["todolistId1"].length).toBe(2);
  expect(endState["todolistId2"].length).toBe(2);
});

test("tasks  title should be changed", () => {
  const model = {
    id: "2",
    title: "juiceNEW",
    description: "",
    todoListId: "todolistId2",
    order: 0,
    status: 2,
    priority: 1,
    startDate: "",
    deadline: "",
    addedDate: "2023-06-07T16:00:25.61",
  };
  const args = { todolistId: "todolistId2", taskId: "2", model };
  const action = tasksThunks.updateTask.fulfilled(args, "requestId", args);

  const endState = tasksReducer(startState, action);

  expect(endState["todolistId2"][1].id).toBe("2");
  expect(endState["todolistId2"][1].title).toBe("juiceNEW");
  expect(endState["todolistId1"].length).toBe(2);
  expect(endState["todolistId2"].length).toBe(2);
});

test("new array should be added when new todolists is added", () => {
  const todolist = {
    id: "todo3",
    title: "new todolists",
    addedDate: "",
    order: 0,
  };
  const action = todolistsThunks.addTodolist.fulfilled({ todolist }, "requestId", { title: todolist.title });
  const endState = tasksReducer(startState, action);
  const keys = Object.keys(endState);
  const newKey = keys.find((k) => k != "todolistId1" && k != "todolistId2");
  if (!newKey) {
    throw Error("new key should be added");
  }

  expect(keys.length).toBe(3);
  expect(endState[newKey]).toEqual([]);
});
