import React, {FC, memo, useCallback, useMemo} from 'react';
import {AddItemForm} from './AddItemForm';
import {EditableSpan} from './EditableSpan';
import IconButton from '@mui/material/IconButton/IconButton';
import {Delete} from '@mui/icons-material';
import {Button} from '@mui/material';
import TaskWithRedux from './TaskWithRedux';
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from './reducers/tasksReducer';
import {useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from './reducers/store';
import {FilterValuesType} from './AppWithRedux';


export type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type PropsType = {
    todolistId: string
    title: string
    changeFilter: (todolistId: string, valueFilter: FilterValuesType) => void
    removeTodolist: (todolistId: string) => void
    changeTodolistTitle: (todolistId: string, newTitle: string) => void
    filter: FilterValuesType
}

export const Todolist: FC<PropsType> = memo((props) => {

    const tasks = useSelector<AppRootStateType, TaskType[]>(state => state.tasks[props.todolistId])
    const dispatch = useDispatch()

    const addTask = useCallback((title: string) => {
        dispatch(addTaskAC(props.todolistId, title))
    },[props.todolistId])

    const changeTodolistTitle = useCallback((title: string) => {
        props.changeTodolistTitle(props.todolistId, title);
    }, [props.todolistId, props.changeTodolistTitle])

    const removeTodolist = useCallback(() => {
        props.removeTodolist(props.todolistId);
    },[props.todolistId])




    const onAllClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'all'), [props.todolistId, props.changeFilter]);
    const onActiveClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'active'), [props.todolistId, props.changeFilter]);
    const onCompletedClickHandler = useCallback(() => props.changeFilter(props.todolistId, 'completed'), [props.todolistId, props.changeFilter]);

    function filteredTasks(): TaskType[] {
        if (props.filter === 'active') {
            return tasks.filter(t => !t.isDone);
        }
        if (props.filter === 'completed') {
            return tasks.filter(t => t.isDone);
        }
        return tasks
    }


    let allTodolistTasks = filteredTasks();

    return <div>
        <h3>
            <EditableSpan value={props.title} onChange={changeTodolistTitle}/>
            <IconButton onClick={removeTodolist}>
                <Delete/>
            </IconButton>
        </h3>
        <AddItemForm addItem={addTask}/>
        <div>
            {
                allTodolistTasks.map(t => <TaskWithRedux
                    todoID={props.todolistId}
                    taskID={t.id}
                />)
            }
        </div>
        <div style={{paddingTop: '10px'}}>
            <ButtonWithMemo
                title={'All'}
                variant={props.filter === 'all' ? 'outlined' : 'text'}
                onClick={onAllClickHandler}
                color={'inherit'}
            />
            <ButtonWithMemo
                title={'Active'}
                variant={props.filter === 'active' ? 'outlined' : 'text'}
                onClick={onActiveClickHandler}
                color={'primary'}
            />
            <ButtonWithMemo
                title={'Completed'}
                variant={props.filter === 'completed' ? 'outlined' : 'text'}
                onClick={onCompletedClickHandler}
                color={'secondary'}
            />
        </div>
    </div>
})

type ButtonWithMemoPropsType = {
    title: string
    onClick: () => void
    variant: 'text' | 'outlined' | 'contained'
    color: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning'
}

const ButtonWithMemo = memo((props: ButtonWithMemoPropsType) => {
    return <Button variant={props.variant}
                   onClick={props.onClick}
                   color={props.color}>{props.title}
    </Button>
})
