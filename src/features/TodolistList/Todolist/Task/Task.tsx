import React, { ChangeEvent, FC, memo, useCallback } from "react";
import { EditableSpan } from "components/EditableSpan/EditableSpan";
import IconButton from "@mui/material/IconButton/IconButton";
import { Delete } from "@mui/icons-material";
import { tasksThunks } from "common/bll/tasksReducer";
import { TaskStatuses, TaskType } from "common/dal/tasksAPI";
import { useAppSelector } from "common/hooks/hooks";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { useActions } from "common/hooks/useActions";

export type PropsType = {
  todoID: string;
  taskID: string;
};

export type TasksStateType = {
  [key: string]: TaskType[];
};

export const Task: FC<PropsType> = memo(({ todoID, taskID }) => {
  const task = useAppSelector<TaskType>((state) => state.tasks[todoID].filter((el) => el.id === taskID)[0]);
  const { updateTask, removeTask } = useActions(tasksThunks);

  const changeStatusHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      updateTask({
        todolistId: todoID,
        taskId: taskID,
        model: { status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New },
      });
    },
    [todoID, taskID],
  );

  const changeTaskTitleHandler = useCallback(
    (newTitle: string) => {
      updateTask({ todolistId: todoID, taskId: taskID, model: { title: newTitle } });
    },
    [todoID, taskID],
  );

  const removeTaskHandler = useCallback(() => {
    removeTask({ todolistId: todoID, taskId: taskID });
  }, [todoID, taskID]);

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? "is-done" : ""}>
      <Checkbox checked={task.status === TaskStatuses.Completed} disabled={task.entityStatus === "loading"} color="success" onChange={changeStatusHandler} />
      <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={task.entityStatus === "loading"} />
      <IconButton onClick={removeTaskHandler} disabled={task.entityStatus === "loading"}>
        <Delete />
      </IconButton>
    </div>
  );
});

export default Task;
