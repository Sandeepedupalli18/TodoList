import './App.css';
import React, { useState, useEffect } from 'react';  // Make sure to import useEffect

const TodoList = () => {
  // 1. Replace your existing useState for tasks with these:
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [completedTasks, setCompletedTasks] = useState(() => {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    return savedCompletedTasks ? JSON.parse(savedCompletedTasks) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [editTask, setEditTask] = useState({ id: null, value: '' });

  // 2. Add these useEffect hooks right after your state declarations:
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // 3. Update your task handling functions:
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: inputValue
    };
    
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const handleEditTask = (id, newText) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: newText } : task
    ));
    setEditTask({ id: null, value: '' });
  };

  const handleCompleteTask = (taskToComplete) => {
    // Remove from tasks
    const updatedTasks = tasks.filter(task => task.id !== taskToComplete.id);
    setTasks(updatedTasks);
    
    // Add to completed tasks
    setCompletedTasks([...completedTasks, taskToComplete]);
  };

  const handleUndoTask = (taskToUndo) => {
    // Remove from completed tasks
    const updatedCompletedTasks = completedTasks.filter(task => task.id !== taskToUndo.id);
    setCompletedTasks(updatedCompletedTasks);
    
    // Add back to tasks
    setTasks([...tasks, taskToUndo]);
  };
  
  const handleDeleteTask = (id, isCompleted = false) => {
    if (isCompleted) {
      setCompletedTasks(completedTasks.filter(task => task.id !== id));
    } else {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  // 4. Your JSX return should look similar to this:
  return (
    <div className="todo-container">
      <h1 className="todo-title">Create your Todo-List</h1>
      
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What are your tasks for today?"
          className="todo-input"
        />
        <button type="submit">ADD</button>
      </form>

      {/* Active Tasks */}
      <div className="todo-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <span>{task.text}</span>
            <div className="task-buttons">
              {editTask.id === task.id ? (
                <div className="edit-form">
                  <input
                    value={editTask.value}
                    onChange={(e) => setEditTask({ ...editTask, value: e.target.value })}
                  />
                  <button onClick={() => handleEditTask(task.id, editTask.value)}>Save</button>
                </div>
              ) : (
                <button  onClick={() => setEditTask({ id: task.id, value: task.text })}>
                  EDIT
                </button>
              )}
              <button onClick={() => handleCompleteTask(task)}>COMPLETED</button>
              <button onClick={() => handleDeleteTask(task.id)}>DELETE</button>
            </div>
          </div>
        ))}
      </div>

      {/* Only show Completed Tasks if there are any */}
      {completedTasks.length > 0 && (
        <div className="completed-tasks">
          <h2>Completed Tasks</h2>
          {completedTasks.map(task => (
            <div key={task.id} className="task-item completed">
              <span>{task.text}</span>
              <div className="task-buttons">
                <button onClick={() => handleUndoTask(task)}>UNDO</button>
                <button onClick={() => handleDeleteTask(task.id, true)}>DELETE</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
