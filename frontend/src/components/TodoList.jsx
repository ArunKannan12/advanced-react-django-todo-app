import React, { useState } from 'react';
import {
  Button,
  Spinner,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import moment from 'moment';
import { FaCheck, FaTrash, FaPen, FaUndo } from 'react-icons/fa';
import { useTodo } from '../utils/TodoContext';
import { toast } from 'react-toastify';
import { useTheme } from '../utils/ThemeContext';
import TodoFilters from './TodoFilters';
import Pagination from '../utils/Pagination';

const TodoList = () => {
  const {
    addTodo,
    todos,
    updateTodo,
    toggleTodo,
    deleteTodo,
    todosLoading,
    setTodos,
    counts,
  } = useTodo();

  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    due_date: '',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { themeMode } = useTheme();

  const handleAdd = async () => {
    const { title, description, due_date } = newTodo;
    if (!title.trim() || !description.trim() || !due_date.trim()) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    await addTodo(title, description, due_date);
    setShowAddModal(false);
    setNewTodo({ title: '', description: '', due_date: '' });
    setLoading(false);
  };

  const handleEdit = async () => {
    if (!editTodo) return;
    const { id, title, description, due_date } = editTodo;
    if (!title.trim() || !description.trim() || !due_date.trim()) {
      return toast.error('All fields are required');
    }
    setLoading(true);
    await updateTodo(id, { title, description, due_date });
    setShowEditModal(false);
    setEditTodo(null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    await deleteTodo(deleteId);
    setShowDeleteConfirm(false);
    setDeleteId(null);
    setLoading(false);
  };

  const toggleComplete = async (todo) => {
    setLoading(true);
    await toggleTodo(todo.id);
    setLoading(false);
  };

  const isOverdue = (todo) => {
    const today = moment().startOf('day');
    const due = moment(todo.due_date);
    return !todo.is_completed && due.isBefore(today);
  };

  return (
    <div
         className={`rounded shadow-sm p-3 p-md-4 mt-4 mx-auto w-100 ${
        themeMode === 'dark' ? 'bg-dark text-light' : 'bg-white text-dark'
      }`}
      style={{
        maxWidth: '768px',
        transition: 'background 0.3s, color 0.3s',
      }}
>

      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h4 className="text-primary m-0">Your Todos</h4>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddModal(true)}
          className="ms-auto"
        >
          + Add Todo
        </Button>
      </div>


       <div className="d-flex flex-wrap gap-2 gap-md-4 mt-2 py-2">
        <span className="badge bg-primary">Total: {counts.total}</span>
        <span className="badge bg-success">Completed: {counts.completed}</span>
        <span className="badge bg-warning text-dark">Incomplete: {counts.incomplete}</span>
        <span className="badge bg-danger">Overdue: {counts.overdue}</span>
        <span className="badge bg-info text-dark">Completed (Overdue): {counts.completed_overdue}</span>
      </div>

      <TodoFilters setTodos={setTodos} />

      {todosLoading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Loading your todos...</p>
        </div>
      ) : todos.length === 0 ? (
        <div className="text-center ">No tasks yet.</div>
      ) : (
        <div className="row g-3 mt-2">
          {todos.map((todo) => (
            <div className="col-12" key={todo.id}>
              <div
                className={`card shadow-sm border-0 
                  ${themeMode === 'dark' ? 'bg-secondary text-light' : ''}
                  ${isOverdue(todo) ? 'bg-danger text-white' : ''}`}
              >
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-start gap-2">
                  <div className="me-md-3 w-100">
                    <h5 className="card-title mb-1 d-flex align-items-center justify-content-between">
                      <span
                        className={
                          todo.is_completed
                            ? 'text-decoration-line-through text-muted'
                            : ''
                        }
                      >
                        {todo.title}
                      </span>
                      <div className="ms-2 d-flex align-items-center gap-2">
                        {isOverdue(todo) && (
                          <span className="badge bg-light text-danger border">
                            Overdue
                          </span>
                        )}
                        <span
                          className={`badge ${
                            todo.is_completed
                              ? 'bg-success'
                              : 'bg-warning text-dark'
                          }`}
                        >
                          {todo.is_completed ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    </h5>

                    {todo.description && (
                      <p className="card-text mb-1">{todo.description}</p>
                    )}

                    <div className="small">
                      {todo.due_date && (
                        <span
                          className={`me-3 ${
                            themeMode === 'dark' ? 'text-light' : 'text-muted'
                          }`}
                        >
                          Due: {moment(todo.due_date).format('MMM D, YYYY')}
                        </span>
                      )}
                      {todo.created_at && (
                        <span
                          className={`${
                            themeMode === 'dark' ? 'text-light' : 'text-muted'
                          }`}
                        >
                          Created: {moment(todo.created_at).format('MMM D, YYYY')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-3 mt-md-0 flex-wrap">
                    <OverlayTrigger
                      overlay={
                        <Tooltip>
                          {todo.is_completed ? 'Undo' : 'Mark as Done'}
                        </Tooltip>
                      }
                    >
                      <Button
                        size="sm"
                        variant={todo.is_completed ? 'secondary' : 'success'}
                        onClick={() => toggleComplete(todo)}
                        disabled={loading}
                      >
                        {todo.is_completed ? <FaUndo /> : <FaCheck />}
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Edit</Tooltip>}>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => {
                          setEditTodo(todo);
                          setShowEditModal(true);
                        }}
                        disabled={loading}
                      >
                        <FaPen />
                      </Button>
                    </OverlayTrigger>

                    <OverlayTrigger overlay={<Tooltip>Delete</Tooltip>}>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => {
                          setDeleteId(todo.id);
                          setShowDeleteConfirm(true);
                        }}
                        disabled={loading}
                      >
                        <FaTrash />
                      </Button>
                    </OverlayTrigger>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>
                Title <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={newTodo.title}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, title: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Description <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter description"
                value={newTodo.description}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, description: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Due Date <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="date"
                value={newTodo.due_date}
                onChange={(e) =>
                  setNewTodo({ ...newTodo, due_date: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAdd} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Add Todo'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Todo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editTodo && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  value={editTodo.title}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, title: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editTodo.description}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, description: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  value={editTodo.due_date}
                  onChange={(e) =>
                    setEditTodo({ ...editTodo, due_date: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleEdit} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this todo? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Yes, Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
      <Pagination/>
    </div>
  );
};

export default TodoList;
