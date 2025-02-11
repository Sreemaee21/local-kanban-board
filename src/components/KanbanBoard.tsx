
"use client"; // Mark this component as a Client Component

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

const KanbanBoard = () => {
  const categories = {
    'Research Engineer': 'bg-blue-100',
    'Personal Research': 'bg-green-100',
    'Learning Goals': 'bg-purple-100',
    'Masters Study': 'bg-yellow-100'
  };

  const initialColumns = {
    todo: {
      id: 'todo',
      title: 'To Do',
      taskIds: []
    },
    inProgress: {
      id: 'inProgress',
      title: 'In Progress',
      taskIds: []
    },
    done: {
      id: 'done',
      title: 'Done',
      taskIds: []
    }
  };

  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState({});
  const [draggedTask, setDraggedTask] = useState(null);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    category: Object.keys(categories)[0],
    description: ''
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedColumns = localStorage.getItem('kanbanColumns');
    const savedTasks = localStorage.getItem('kanbanTasks');
    
    if (savedColumns) {
      setColumns(JSON.parse(savedColumns));
    }
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('kanbanColumns', JSON.stringify(columns));
    localStorage.setItem('kanbanTasks', JSON.stringify(tasks));
  }, [columns, tasks]);

  const handleDragStart = (taskId) => {
    setDraggedTask(taskId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    const column = columns[columnId];
    if (!column.taskIds.includes(draggedTask)) {
      const updatedColumns = { ...columns };
      // Remove from old column
      Object.keys(columns).forEach(colId => {
        updatedColumns[colId].taskIds = updatedColumns[colId].taskIds.filter(id => id !== draggedTask);
      });
      // Add to new column
      updatedColumns[columnId].taskIds.push(draggedTask);
      setColumns(updatedColumns);
    }
  };

  const handleAddTask = () => {
    if (newTask.title.trim() === '') return;

    const taskId = `task-${Date.now()}`;
    const task = {
      id: taskId,
      title: newTask.title,
      category: newTask.category,
      description: newTask.description,
      dateAdded: new Date().toISOString(),
    };

    setTasks(prev => ({ ...prev, [taskId]: task }));
    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [...prev.todo.taskIds, taskId]
      }
    }));

    setNewTask({
      title: '',
      category: Object.keys(categories)[0],
      description: ''
    });
    setShowNewTaskForm(false);
  };

  // Add function to clear all data
  const handleClearBoard = () => {
    if (window.confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
      setColumns(initialColumns);
      setTasks({});
      localStorage.removeItem('kanbanColumns');
      localStorage.removeItem('kanbanTasks');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Personal Kanban Board</h1>
        <div className="flex gap-2">
          <Button 
            onClick={() => setShowNewTaskForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Task
          </Button>
          <Button 
            variant="destructive"
            onClick={handleClearBoard}
          >
            Clear Board
          </Button>
        </div>
      </div>

      {showNewTaskForm && (
        <Card className="mb-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-semibold">New Task</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowNewTaskForm(false)}
            >
              <X size={16} />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              />
              <select
                className="w-full p-2 border rounded"
                value={newTask.category}
                onChange={(e) => setNewTask(prev => ({ ...prev, category: e.target.value }))}
              >
                {Object.keys(categories).map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              />
              <Button onClick={handleAddTask}>Create Task</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-3 gap-4">
        {Object.values(columns).map(column => (
          <div
            key={column.id}
            className="bg-gray-100 p-4 rounded-lg"
            onDragOver={(e) => handleDragOver(e, column.id)}
          >
            <h2 className="font-bold mb-4">{column.title}</h2>
            <div className="space-y-2">
              {column.taskIds.map(taskId => {
                const task = tasks[taskId];
                return (
                  <Card
                    key={taskId}
                    draggable
                    onDragStart={() => handleDragStart(taskId)}
                    className={`${categories[task.category]} cursor-move`}
                  >
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="mt-2 text-xs text-gray-500">
                        {new Date(task.dateAdded).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;