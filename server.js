const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const mongoose = require('mongoose');
const { check } = require('express-validator');


const app = express();

app.use(express.json());
const mongourl="mongodb+srv://febinjohn725:VPoWCbifmCaOoW9R@cluster0.psavxgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongourl, {
    useNewUrlParser: true,
}).then(() => {
    console.log("connected")
})
    .catch((e) => {
        console.log(e)
    })


const User = require('./Schema/voter');
const User2 = require('./Schema/Admin');
const project = require('./Schema/project');

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

app.post('/signup', [
    check('name').notEmpty(),
    check('age').notEmpty(),
    check('gender').notEmpty(),
    check('district').notEmpty(),
    check('constituency').notEmpty(),
    check('mobileNumber').notEmpty(),
    check('aadharNo').notEmpty(),
    check('email').isEmail(),
    check('password').isLength({ min: 8 }),
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, age, gender, district, constituency, mobileNumber, aadharNo, email, password } = req.body;

        // Check if user with same email exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
            user = new User({
                name,
                age,
                gender,
                district,
                constituency,
                mobileNumber,
                aadharNo,
                email,
                password: hashedPassword,
            });
        // Save user to database
        await user.save();

        // Here, you can send the verification screen URL or some identifier in the response
        // For demonstration purposes, let's assume the verification screen URL is '/verification'
        res.status(200).json({ message: 'User signed up successfully', verificationURL: '/verification' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

app.post('/projectadd', async (req, res) => {
    try {
        // Extracting data from the request body
        const { constituency, projectId, projectName, projectType, totalBudget, projectDescription } = req.body.info;

        // Create a new project document
        const newProject = new project({
            constituency,
            projectId,
            projectName,
            projectType,
            totalBudget,
            projectDescription
        });

        // Save the new project to the database
        await newProject.save();

        // Respond with success message
        return res.status(201).json({ message: 'Project created successfully' });
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
