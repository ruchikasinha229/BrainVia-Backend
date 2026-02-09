const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 👇👇👇 CLOUD DATABASE CONNECTION (Updated with your BrainVia Link) 👇👇👇
mongoose.connect('mongodb+srv://admin:BrainVia2026@cluster0.s0fpe82.mongodb.net/brainvia?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('✅ BrainVia Connected to CLOUD Database!'))
    .catch(err => console.error('❌ Cloud Connection Error:', err));

// ---------------- SCHEMAS ---------------- //

const UserSchema = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: 'student' }, 
    wallet: { type: Number, default: 1000 },
    purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    instructor: String,
    syllabus: [{
        topic: String,
        videoUrl: String
    }],
    quiz: [{
        question: String,
        options: [String],
        correctAnswer: Number 
    }],
    marathonUrl: String
});

const User = mongoose.model('User', UserSchema);
const Course = mongoose.model('Course', CourseSchema);

// ---------------- ROUTES ---------------- //

// 1. REGISTER
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const newUser = new User({ email, password, role });
        await newUser.save();
        res.json({ message: "Success" });
    } catch (err) {
        res.status(400).json({ message: "User already exists" });
    }
});

// 2. LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ message: "Success", user });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
});

// 3. GET ALL COURSES
app.get('/courses', async (req, res) => {
    const courses = await Course.find();
    res.json(courses);
});

// 4. BUY COURSE 
app.post('/buy', async (req, res) => {
    const { userId, courseId } = req.body;
    try {
        const user = await User.findById(userId);
        const course = await Course.findById(courseId);

        if (!user || !course) return res.status(404).json({ message: "Not Found" });

        if (user.purchasedCourses.includes(courseId)) {
            return res.json({ message: "Already owned", updatedUser: user });
        }

        if (user.wallet < course.price) {
            return res.status(400).json({ message: "Insufficient Funds" });
        }

        user.wallet -= course.price; 
        user.purchasedCourses.push(courseId); 
        await user.save();
        
        res.json({ message: "Success", updatedUser: user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Transaction Failed" });
    }
});

// 5. INSTRUCTOR: ADD COURSE
app.post('/add-course', async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.json({ message: "Course Added!" });
    } catch (err) {
        res.status(500).json({ message: "Error adding course" });
    }
});

// ---------------- START SERVER ---------------- //
app.listen(5000, () => {
    console.log("🚀 BrainVia Server running on Port 5000");
});
