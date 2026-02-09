const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 1. Connect to Database
mongoose.connect('mongodb://127.0.0.1:27017/udemyClone')
    .then(() => console.log('✅ Database Connected!'))
    .catch(err => console.error('❌ Database Connection Error:', err));

// 2. Define Data Models

// A. USER MODEL (The Logic for Accounts)
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }
});
const User = mongoose.model('User', UserSchema);

// B. COURSE MODEL (The Logic for Advanced Courses)
const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    syllabus: [
        { topic: String, videoUrl: String }
    ],
    quiz: [
        { question: String, options: [String], correctAnswer: Number }
    ],
    marathonUrl: String
});
const Course = mongoose.model('Course', CourseSchema);


// --- ROUTES ---

// Route 1: Register New User
app.post('/register', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: "User Registered!", user: newUser });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ message: "Registration failed" });
    }
});

// Route 2: Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: "Success", user: user });
        } else {
            res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
});

// Route 3: Get All Courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Route 4: Create New Course (Instructor)
app.post('/courses', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(500).json({ message: "Failed to save course" });
    }
});

// 3. Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});