import React, { useState, useEffect } from "react";
import "../css/Todos.css";
import axios from 'axios';

const Todos = ({ user }) => {
  const [todos, setTodos] = useState([]);
  const [sorting, setSorting] = useState("sequential");
  const [newTodo, setNewTodo] = useState("");
  const [filterType, setFilterType] = useState("all");
  const u=user;
  useEffect(() => {
    if (user && user.id) { // Add a conditional check
      axios.get(`http://localhost:3010/users/${user.id}/todos/all`)
        .then(response => {
          setTodos(response.data);
          console.log('success');
        })
        .catch(error => {
          console.error(error);
        });
    }
  }, [user]);

  const handleSortingChange = (e) => {
    setSorting(e.target.value);
  };

  const sortedTodos = [...todos].sort((a, b) => {
    switch (sorting) {
      case "sequential":
        return a.id - b.id;
      case "completed":
        return a.completed - b.completed;
      case "alphabetical":
        return a.title.localeCompare(b.title);
      case "random":
        return Math.random() - 0.5;
      default:
        return 0;
    }
  });


  
  const handleCheckBoxChange = (todo_id) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todo_id) {
        const updatedTodo = { ...todo, completed: Number(!todo.completed) };
        console.log(updatedTodo);
        axios.put(`http://localhost:3010/todos/${todo_id}`, updatedTodo)
          .then(response => {
            console.log('Todo updated successfully');
            // Perform any additional actions after successful update
            setTodos(prevTodos => {
              return prevTodos.map(prevTodo => {
                if (prevTodo.id === todo_id) {
                  return { ...prevTodo, completed: Number(!todo.completed) };
                }
                return prevTodo;
              });
            });
          })
          .catch(error => {
            console.error('Error updating todo:', error);
            // Handle error
          });
        return updatedTodo; // Return the updated todo immediately
      }
  
      return todo; // Return the original todo if not updated
    });
  
    setTodos(updatedTodos); // Update the state with the updated todos immediately
  };

  const handleAddTodo = () => {
    const newTodoObj = {
      user_id: u.id,
      title: newTodo,
      completed: 0,
    };
    console.log(newTodoObj);
    axios
      .post("http://localhost:3010/todos", newTodoObj)
      .then(response => {
        console.log("Todo added successfully");
        // Update the todos on the client side
    const updatedTodos = [...todos, newTodoObj];
    setTodos(updatedTodos);
    setNewTodo("");
    })
    .catch(error => {
      console.error("Error adding todo:", error);
    });
  };

  const handleUpdateTodo = (todo_id, updatedTitle) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === todo_id) {
        const updatedTodo = { ...todo, title: updatedTitle };
        console.log(updatedTodo);
        axios.put(`http://localhost:3010/todos/${todo_id}`, updatedTodo)
          .then(response => {
            console.log('Todo updated successfully');
            // Perform any additional actions after successful update
            setTodos(prevTodos => {
              return prevTodos.map(prevTodo => {
                if (prevTodo.id === todo_id) {
                  return { ...prevTodo, title: updatedTitle };
                }
                return prevTodo;
              });
            });
          })
          .catch(error => {
            console.error('Error updating todo:', error);
            // Handle error
          });
  
        return updatedTodo; // Return the updated todo immediately
      }
  
      return todo; // Return the original todo if not updated
    });
  
    setTodos(updatedTodos); // Update the state with the updated todos immediately
  };
  
  const handleDeleteTodo = (todo_id) => {
    axios
      .delete(`http://localhost:3010/todos/${todo_id}`)
      .then(response => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todo_id));
        console.log('success');
      })
      .catch(error => {
        console.error(error);
      });
  };
  
  const handleFilterChange = (e) => {
    const selectedFilter = e.target.value;
    setFilterType(selectedFilter);
  
    // Make an HTTP request to the server to get filtered todos
    axios.get(`http://localhost:3010/users/${user.id}/todos/${selectedFilter}`)
      .then(response => {
        setTodos(response.data);
      })
      .catch(error => {
        console.error('Error retrieving filtered todos:', error);
      });
  };
  
  return (
    <div className="todos-container">
      <div className="sorting-container">
        <label htmlFor="sorting">Sort by:</label>
        <select id="sorting" value={sorting} onChange={handleSortingChange}>
          <option value="sequential">Sequential</option>
          <option value="completed">Completed</option>
          <option value="alphabetical">Alphabetical</option>
          <option value="random">Random</option>
        </select>
      </div>
      <div className="filtering-container">
        <label htmlFor="filter">Filter by:</label>
        <select id="filter" value={filterType} onChange={handleFilterChange}>
          <option value="all">All</option>
          <option value="completed">Completed</option>
          <option value="uncompleted">Not Completed</option>
        </select>
      </div>
      <hr></hr>
      <div className="todos-list">
        {sortedTodos.map((todo) => (
          <div key={todo.id} className="todo-item">
            <input
              type="checkbox"
              onChange={() => handleCheckBoxChange(todo.id)}
              style={{ accentColor: "#cf3a6c" }}
              checked={todo.completed}
            />
            {todo.completed === 1 ? (
              <span>
                <s>{todo.title}</s>
              </span>
            ) : (
              <span>{todo.title}</span>
            )}
            <button
              onClick={() => {
                const updatedTitle = prompt(
                  "Enter the updated title:",
                  todo.title
                );
                if (updatedTitle) {
                  handleUpdateTodo(todo.id, updatedTitle);
                }
              }}
            >
              Update
            </button>
            <button onClick={() => handleDeleteTodo(todo.id)}>Delete</button>
          </div>
        ))}
      </div>
      <div className="add-todo-container">
        <input
          type="text"
          placeholder="Enter a new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};

export default Todos;