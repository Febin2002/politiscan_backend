const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('./db');

const app = express();

app.use(express.json());

const User = require('./Schema/voter');
const User2 = require('./Schema/Admin');
// Secret key for JWT
const secretKey = crypto.randomBytes(32).toString('hex');
console.log(secretKey);


// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
    req.userId = decoded.id;
    next();
  });
};

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      const user2 = await User2.findOne({ email });
  
      if (!user && !user2) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
  
      if (user) {
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
  
        const token = jwt.sign({ userId: user.email }, secretKey);
        return res.json({ token, details: user });
      }
  
      if (user2) {
        const validPassword1 = await bcrypt.compare(password, user2.password);
        if (!validPassword1) {
          return res.status(400).json({ error: 'Invalid credentials' });
        }
  
        const token = jwt.sign({ userId: user2.email }, secretKey);
        return res.json({ token, details: user2 });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });
  


// Protected route
app.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'You are authorized!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
