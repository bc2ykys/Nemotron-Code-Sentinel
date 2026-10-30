const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const SECRET_KEY = "mysecretkey123";  // Hardcoded secret
const users = {};

app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  // User can set their own role including "admin"
  users[username] = { password: password, role: role || 'user' };
  res.json({ message: 'Registered!' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  
  if (user && user.password === password) {  // Plaintext comparison
    const token = jwt.sign(
      { username, role: user.role },
      SECRET_KEY,
      { expiresIn: '30d' }  // Token valid for 30 days
    );
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Admin route - no middleware protection
app.get('/admin/users', (req, res) => {
  const token = req.headers.authorization;
  const decoded = jwt.decode(token);  // decode, not verify!
  
  if (decoded.role === 'admin') {
    res.json(users);  // Returns all users with passwords
  }
});

app.delete('/admin/user/:id', (req, res) => {
  // No authorization check at all
  delete users[req.params.id];
  res.json({ message: 'User deleted' });
});

app.listen(3000);
