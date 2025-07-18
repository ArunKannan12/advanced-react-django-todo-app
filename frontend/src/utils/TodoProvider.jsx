import { useEffect, useState } from "react";
import { TodoContext } from "./TodoContext";
import axiosInstance from "./axiosInstance";
import { toast } from "react-toastify";
import { useAuth } from "./AuthContext";

export const TodoProvider = ({ children }) => {
  const [todos, setTodos] = useState([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [counts,setCounts] = useState({
    total: 0,
    completed: 0,
    incomplete: 0,
    overdue: 0,
    completed_overdue: 0,
  })

  const [page, setPage] = useState(1);
  const [pageSize] = useState(5); // You can make this dynamic
  const [totalPages, setTotalPages] = useState(1);

  const {
    user,
    accessToken,
    isAuthenticated,
    loading: authLoading,
  } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setTodos([]); // ✅ clear on logout
      setPage(1);
    }
  }, [isAuthenticated]);
  
 
  const fetchTodos = async (pageNum=page) => {
    try {
      setTodosLoading(true);
      if (!accessToken || !user?.id) return;

       const res = await axiosInstance.get("todos/", {
        params: {
          page: pageNum,
          page_size: pageSize,
        },
      });
      setTodos(res.data.results || res.data);
      setTotalPages(Math.ceil(res.data.count / pageSize));
      
    } catch (error) {
      console.error("Failed to fetch todos:", error);
      toast.error(error.response?.data?.error || "Failed to load todos.");
    } finally {
      setTodosLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated && accessToken && user?.id) {
      fetchTodos(page);
    }
  }, [authLoading, isAuthenticated, accessToken, user?.id,page]);


  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axiosInstance.get('todos/stats/');
        setCounts(res.data);
        console.log(res.data);
      } catch (error) {
        if (error.response?.status === 401) {
          console.log("Not authenticated — skipping stats fetch");
        } else {
          toast.error(error.response?.data?.detail || "Failed to fetch todo stats");
        }
      }
    };

    const accessToken = localStorage.getItem('access') || sessionStorage.getItem('access');
    if (accessToken) {
      fetchCounts();
    }
  }, [todos]);




  const addTodo = async (title, description, due_date) => {
    try {
      const res = await axiosInstance.post("todos/", {
        title,
        description,
        due_date,
      });
      setTodos((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Add todo failed:", error);
      toast.error("Failed to add todo.");
    }
  };

  const updateTodo = async (id, updatedTodo) => {
    try {
      const res = await axiosInstance.patch(`todos/${id}/`, updatedTodo);
      setTodos((prev) =>
        prev.map((todo) => (todo.id === id ? { ...todo, ...res.data } : todo))
      );
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update todo.");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axiosInstance.delete(`todos/${id}/`);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete todo.");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await axiosInstance.patch(`todos/${id}/`, {
        is_completed: !todo.is_completed,
      });
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...res.data } : t))
      );
    } catch (error) {
      console.error("Toggle failed:", error);
      toast.error("Failed to toggle todo.");
    }
  };

  const clearTodos = () => setTodos([]); // ✅ helpful for logout

  return (
    <TodoContext.Provider
      value={{
        todos,
        todosLoading,
        setTodos,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleTodo,
        clearTodos,
        setCounts,
        counts,
        page,
        setPage,
        totalPages
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};
