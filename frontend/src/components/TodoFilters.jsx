import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';

const TodoFilters = ({ setTodos }) => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [ordering, setOrdering] = useState('-created_at');
  const [dateFilter,setDateFilter] = useState('')
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  
  useEffect(() => {
    const fetchFilteredTodos = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('todos/', {
          params: {
            search,
            is_completed: status,
            ordering,
            due_date:dateFilter,
            ...(status === 'overdue' ? {overdue:true}: {is_completed:status})
          },
        });
        const data = Array.isArray(res.data)
        
          ? res.data
          : res.data.results || [];

        setTodos(data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to fetch filtered todos.');
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredTodos();
  }, [search, status, ordering, setTodos,dateFilter]);

   const handleReset = async () => {
    setResetLoading(true); // 👈 separate loading for reset
    try {
      setSearch('');
      setStatus('');
      setOrdering('-created_at');
      setDateFilter('');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <Form className="mb-3">
      <Row className="g-2 align-items-center">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search title/description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>

        <Col md={3}>
          <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="true">Completed</option>
            <option value="false">Incomplete</option>
            <option value="overdue">Overdue</option>
          </Form.Select>
        </Col>

        <Col md={3}>
          <Form.Select value={ordering} onChange={(e) => setOrdering(e.target.value)}>
            <option value="-created_at">Newest First</option>
            <option value="created_at">Oldest First</option>
            <option value="due_date">Due Date (Soonest)</option>
            <option value="-due_date">Due Date (Latest)</option>
          </Form.Select>
        </Col>
        <Col md={2}>
          <Form.Control
            type="date"
            value={dateFilter}
            disabled={loading}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Col>

        <Col md={2}>
          <Button variant="secondary" onClick={handleReset} disabled={resetLoading} className="w-100">
            {resetLoading ? 'Resetting...' : 'Reset'}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default TodoFilters;
