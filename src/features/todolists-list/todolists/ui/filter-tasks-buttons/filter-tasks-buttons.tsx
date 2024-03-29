import Button from "@mui/material/Button/Button";
import React, { FC } from "react";
import { useActions } from "common/hooks/useActions";
import { todolistsActions } from "features/todolists-list/todolists/model/todolist-reducer";
import { FilterValuesType } from "features/todolists-list/todolists-list";
import s from "../todolist.module.css";

type Props = {
  filter: FilterValuesType;
  todolistId: string;
};

export const FilterTasksButtons: FC<Props> = ({ filter, todolistId }) => {
  const { changeFilterTodolist } = useActions(todolistsActions);
  return (
    <div className={s.buttonWrapper}>
      <Button variant={filter === "all" ? "outlined" : "text"} onClick={() => changeFilterTodolist({ todolistId, filterValue: "all" })} color={"inherit"} className={s.button}>
        All
      </Button>

      <Button variant={filter === "active" ? "outlined" : "text"} onClick={() => changeFilterTodolist({ todolistId, filterValue: "active" })} color={"primary"} className={s.button}>
        Active
      </Button>

      <Button variant={filter === "completed" ? "outlined" : "text"} onClick={() => changeFilterTodolist({ todolistId, filterValue: "completed" })} color={"secondary"} className={s.button}>
        Completed
      </Button>
    </div>
  );
};
