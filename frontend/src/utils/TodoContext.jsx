import { createContext,useContext } from "react";


export const TodoContext = createContext({
    todos:[],
    todosLoading: false,
    fetchTodos: () => {},
    clearTodos: () => {},
    addTodo:(title,description,due_date)=>{},
    updateTodo:(id,updatedTodo)=>{},
    deleteTodo:(id)=>{},
    toggleTodo:(id)=>{},
    total: 0,
    completed: 0,
    incomplete: 0,
    overdue: 0,
    completedOverdue: 0,


})


export const useTodo = ()=>useContext(TodoContext)