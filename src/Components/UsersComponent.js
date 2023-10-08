import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersComponent = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
   
   addUser();
  fetchUsers();

  }, []);


  
  const addUser = () => { 
    const newUser = {
      name: 'John Doe',
      username: 'johndoe',
      password: 'password123',
      email: 'johndoe@example.com',
      phone: '1234567890',
      website: 'johndoe.com'
    };
    axios.post('http://localhost:3010/users',newUser )
    .then(response => {
      console.log(response.data);
      console.log('success');
    })
    .catch(error => {
      console.error(error);
    });
  };

  const fetchUsers = () => {
    axios.get('http://localhost:3010/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  };
  const getUser = (userId) => {
    axios.get(`http://localhost:3010/users/${userId}`)
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
  };
 

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <div key={user.id}>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default UsersComponent;
