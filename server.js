const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
const port = 3010;
app.use(cors()); 
// Create MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'project6',
    database: 'db6'
  });

// Connect to the MySQL database
connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
  } else {
    console.log('Connected to the database');
  }
});
//-----------------------------------------------------------------Users
  // Read all users
  app.get('/users', (req, res) => {
    const query = 'SELECT * FROM users';
  
    connection.query(query, (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
      } else {
        res.json(results);
      }
    });
  });
// Create a new user
app.post('/users', (req, res) => {
  const getIndexQuery = "SELECT value FROM indexes WHERE table_name = 'users'";

  connection.query(getIndexQuery, (error, indexResults) => {
    if (error) {
      console.log("Failed to fetch index");
      res.status(500).json({ error: 'Failed to fetch index' });
      return;
    }

    const id = indexResults[0].value + 1; // Increment the value
    console.log(id);
    console.log(req.body);
    const { name, username, password, email, phone, website } = req.body;
    const insertQuery = `INSERT INTO users (id, name, username,  email, phone, website) VALUES (?, ?, ?, ?, ?, ?)`;
    
    connection.query(insertQuery, [id, name, username, email, phone, website], (error, results) => {
      if (error) {
        console.log("Failed to create user");
        res.status(500).json({ error: 'Failed to create user' });
      } else {
        const addUserPasQuery = `INSERT INTO users_pas (id, password) VALUES (?, ?)`;
        
        connection.query(addUserPasQuery, [id, password], (error) => {
          if (error) {
            console.log("Failed to add user to users_pas");
            res.status(500).json({ error: 'Failed to add user to users_pas' });
          } else {
            const updateIndexQuery = "UPDATE indexes SET value = value + 1 WHERE table_name = 'users'";
        
            connection.query(updateIndexQuery, (error) => {
              if (error) {
                console.log("Failed to update index");
                res.status(500).json({ error: 'Failed to update index' });
              } else {
                console.log("User created successfully");
                res.status(201).json({ message: 'User created successfully' });
              }
            });
          }
        });
      }
    });
  });
});

// Read a single user
app.get('/users/:username', (req, res) => {
  const { username } = req.params;
  const { password } = req.query;
  const query = 'SELECT u.id, u.name, u.username, u.email, u.phone, u.website, p.password ' +
                'FROM users u ' +
                'JOIN users_pas p ON u.id = p.id ' +
                'WHERE u.username = ?';

  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Failed to fetch user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
      return;
    }

    if (results.length === 0) {
      console.log('User not found');
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = results[0];

    // Check if the provided password matches the user's password
    if (password !== user.password) {
      console.log('Incorrect password');
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    // Password is correct, remove the password field and return the user details
    delete user.password;
    res.json(user);
  });
});

  
// Update a user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, username, password, email, phone, website } = req.body;

  // Check if the provided password is correct
  connection.query('SELECT * FROM users_pass WHERE id = ? AND password = ?', [id, password], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update user' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    // Update the user details
    const query = 'UPDATE users SET name = ?, username = ?, email = ?, phone = ?, website = ? WHERE id = ?';
    connection.query(query, [name, username, email, phone, website, id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to update user' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    });
  });
});

  
  // Delete a user
  app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM users WHERE id = ?';
  
    connection.query(query, [id], (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Failed to delete user' });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json({ message: 'User deleted successfully' });
      }
    });
  });


//--------------------------------------------------------------------TODOS

// Create a new todo
app.post('/todos', (req, res) => {
  const { user_id, title, completed } = req.body;
  
  // Get the current value of the "todos" index from the "next_indexes" table
  connection.query('SELECT value FROM indexes WHERE table_name = "todos"', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Error creating todo');
      return;
    }

    const currentValue = results[0].value;
    const nextValue = currentValue + 1;

    // Update the value of the "todos" index in the "next_indexes" table
    connection.query('UPDATE indexes SET value = ? WHERE table_name = "todos"', [nextValue], (err) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error creating todo');
        return;
      }

      // Insert the new todo with the updated index value
      const query = 'INSERT INTO todos (id, user_id, title, completed) VALUES (?, ?, ?, ?)';
      connection.query(query, [nextValue,user_id, title, completed], (err) => {
        if (err) {
          console.error('Error executing query:', err);
          res.status(500).send('Error creating todo');
          return;
        }

        res.status(201).json({ id: currentValue });
      });
    });
  });
});

// Get all todos of a specific user
app.get('/users/:user_id/todos/all', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM todos WHERE user_id = ?';
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error retrieving todos:', err);
      res.status(500).send('Error retrieving todos');
      return;
    }
    res.json(results);
  });
});

// Get all DONE todos of a specific user
app.get('/users/:user_id/todos/completed', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM todos WHERE user_id = ? and completed=1';
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error retrieving todos:', err);
      res.status(500).send('Error retrieving todos');
      return;
    }
    res.json(results);
  });
});
// Get all UNDONE todos of a specific user
app.get('/users/:user_id/todos/uncompleted', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM todos WHERE user_id = ? and completed=0';
  connection.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('Error retrieving todos:', err);
      res.status(500).send('Error retrieving todos');
      return;
    }
    res.json(results);
  });
});
// Update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title,  completed } = req.body;
  const query = 'UPDATE todos SET title = ?,completed = ? WHERE id = ?';
  connection.query(query, [title, completed, id], (err) => {
    if (err) {
      console.error('Error updating todo:', err);
      res.status(500).send('Error updating todo');
      return;
    }
    res.sendStatus(200);
  });
});

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting todo:', err);
      res.status(500).send('Error deleting todo');
      return;
    }
    res.sendStatus(200);
  });
});
//------------------------------------------------------------------------------------POSTS
app.post('/posts', (req, res) => {
  const { user_id, title, body } = req.body;

  // Retrieve the next ID from the "indexes" table
  connection.query('SELECT value FROM indexes WHERE table_name = "posts"', (err, results) => {
    if (err) {
      console.error('Error retrieving next ID:', err);
      res.status(500).send('Error creating post');
      return;
    }

    const nextId = results[0].value;

    // Update the "indexes" table with the next ID
    const updateQuery = 'UPDATE indexes SET value = ? WHERE table_name = "posts"';
    connection.query(updateQuery, [nextId + 1], (err) => {
      if (err) {
        console.error('Error updating next ID:', err);
        res.status(500).send('Error creating post');
        return;
      }

      // Insert the new post with the retrieved ID
      const insertQuery = 'INSERT INTO posts (id, user_id, title, body) VALUES (?, ?, ?, ?)';
      connection.query(insertQuery, [nextId, user_id, title, body], (err) => {
        if (err) {
          console.error('Error creating post:', err);
          res.status(500).send('Error creating post');
          return;
        }
        res.status(201).json({ id: nextId });
      });
    });
  });
});
//get all user posts
app.get('/users/:user_id/posts', (req, res) => {
  const { user_id } = req.params;
  const query = 'SELECT * FROM posts WHERE user_id = ?and available IS NULL OR available = 1' ;
 
  connection.query(query,[user_id], (err, results) => {
    if (err) {
      console.error('Error retrieving posts:', err);
      res.status(500).send('Error retrieving posts');
      return;
    }
    res.json(results);
  });
});

//get all  posts
app.get('/posts', (req, res) => {
  const query = 'SELECT * FROM posts WHERE  available IS NULL OR available = 1' ;
 
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving posts:', err);
      res.status(500).send('Error retrieving posts');
      return;
    }
    res.json(results);
  });
});
app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, title, body } = req.body;
  const query = 'UPDATE posts SET user_id = ?, title = ?, body = ? WHERE id = ?';
  connection.query(query, [user_id, title, body, id], (err) => {
    if (err) {
      console.error('Error updating post:', err);
      res.status(500).send('Error updating post');
      return;
    }
    res.sendStatus(200);
  });
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  const query = 'UPDATE posts SET available=0 WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting post:', err);
      res.status(500).send('Error deleting post');
      return;
    }
    res.sendStatus(200);
  });
});

//-------------------------------------------------------Comments
app.get('/comments', (req, res) => {
  const query = 'SELECT * FROM comments';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error retrieving comments:', err);
      res.status(500).send('Error retrieving comments');
      return;
    }
    res.json(results);
  });
});
//Add new comment
app.post('/comments', (req, res) => {
  const { post_id, name, email, body } = req.body;

  // Retrieve the next ID from the "indexes" table
  connection.query('SELECT value FROM indexes WHERE table_name = "comments"', (err, results) => {
    if (err) {
      console.error('Error retrieving next ID:', err);
      res.status(500).send('Error creating comment');
      return;
    }

    const nextId = results[0].value;

    // Update the "indexes" table with the next ID
    const updateQuery = 'UPDATE indexes SET value = ? WHERE table_name = "comments"';
    connection.query(updateQuery, [nextId + 1], (err) => {
      if (err) {
        console.error('Error updating next ID:', err);
        res.status(500).send('Error creating comment');
        return;
      }

      // Insert the new comment with the retrieved ID
      const insertQuery = 'INSERT INTO comments (id, post_id, name, email, body) VALUES (?, ?, ?, ?, ?)';
      connection.query(insertQuery, [nextId, post_id, name, email, body], (err) => {
        if (err) {
          console.error('Error creating comment:', err);
          res.status(500).send('Error creating comment');
          return;
        }
        res.status(201).json({ id: nextId });
      });
    });
  });
});
app.get('/comments/:post_id', (req, res) => {
  const { post_id } = req.params;
  const query = 'SELECT * FROM comments WHERE post_id = ?';
  connection.query(query, [post_id], (err, results) => {
    if (err) {
      console.error('Error retrieving comments:', err);
      res.status(500).send('Error retrieving comments');
      return;
    }
    res.json(results);
  });
});


app.put('/comments/:id', (req, res) => {
  const { id } = req.params;
  const { post_id, name, email, body } = req.body;
  const query = 'UPDATE comments SET post_id = ?, name = ?, email = ?, body = ? WHERE id = ?';
  connection.query(query, [post_id, name, email, body, id], (err) => {
    if (err) {
      console.error('Error updating comment:', err);
      res.status(500).send('Error updating comment');
      return;
    }
    res.sendStatus(200);
  });
});

app.delete('/comments/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM comments WHERE id = ?';
  connection.query(query, [id], (err) => {
    if (err) {
      console.error('Error deleting comment:', err);
      res.status(500).send('Error deleting comment');
      return;
    }
    res.sendStatus(200);
  });
});





// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});



