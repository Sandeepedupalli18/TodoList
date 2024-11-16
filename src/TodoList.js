import { useState } from 'react';
import './App.css';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  const addTodo = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    setTodos([...todos, {
      id: Date.now(),
      text: newTask,
      completed: false,
      completedAt: null
    }]);
    setNewTask('');
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { 
            ...todo, 
            completed: !todo.completed,
            completedAt: !todo.completed ? Date.now() : null 
          } 
        : todo
    ).sort((a, b) => {
      // Sort completed items to bottom
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      // For completed items, sort by completion time
      if (a.completed && b.completed) {
        return b.completedAt - a.completedAt;
      }
      // For incomplete items, maintain original order
      return 0;
    }));
  };

  // Separate active and completed todos
  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todo-container">
      <h1 className="todo-title">Create your Todo-List</h1>
      
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What are your tasks for today?"
          className="todo-input"
        />
        <button type="submit" className="add-button">
          Add
        </button>
      </form>

      <div className="todo-list">
        {/* Active Todos */}
        {activeTodos.map(todo => (
          <div key={todo.id} className="todo-item">
            <span className="todo-text">
              {todo.text}
            </span>
            <div className="button-container">
              <button
                onClick={() => {}}
                className="action-button edit-button"
              >
                EDIT
              </button>
              <button
                onClick={() => toggleComplete(todo.id)}
                className="action-button complete-button"
              >
                COMPLETED
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="action-button delete-button"
              >
                DELETE
              </button>
            </div>
          </div>
        ))}

        {/* Completed Todos */}
        {completedTodos.length > 0 && (
          <div className="completed-section">
            <h2 className="completed-title">Completed Tasks</h2>
            {completedTodos.map(todo => (
              <div key={todo.id} className="todo-item completed-item">
                <span className="todo-text completed">
                  {todo.text}
                </span>
                <div className="button-container">
                  <button
                    onClick={() => toggleComplete(todo.id)}
                    className="action-button complete-button"
                  >
                    UNDO
                  </button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="action-button delete-button"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;