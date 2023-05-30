import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://social-network.samuraijs.com/api/1.0',
    withCredentials: true
})

type TodolistType = {
    id: string
    title: string
    addedDate: string
    order: number
}

type ResponseType<D> = {
    resultCode: number
    messages: string[]
    data: D
}

export const TodolistsApi = {
    getTodolists() {
        return instance.get<TodolistType[]>('/todo-lists')
    },
    createTodolist() {
        return instance.post<ResponseType<{item:TodolistType}>>('/todo-lists', {title: 'newTodo'})
    },
    updateTitleTodo(id: string, title: string) {
        return instance.put<ResponseType<{}>>(`/todo-lists/${id}`, {title})
    },
    deleteTodo(id: string) {
        return instance.delete<ResponseType<{}>>(`/todo-lists/${id}`)
    },
    getTask(id:string){
        return instance.get<any>(`/todo-lists/${id}/tasks`)
    }
}