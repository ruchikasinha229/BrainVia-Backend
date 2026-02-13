import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 👇 I FIXED THIS PART FOR YOU:
const MONGO_URI = 'mongodb+srv://admin:BrainVia2026@cluster0.s0fpe82.mongodb.net/brainvia?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ Database Connected!"))
    .catch(err => console.error("❌ Database Error:", err));

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    wallet: { type: Number, default: 0 }
});
const User = mongoose.model('User', UserSchema);

const CourseSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    video: String,
    instructor: String
});
const Course = mongoose.model('Course', CourseSchema);

// --- ROUTES ---

// Register
app.post('/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const newUser = new User({ email, password, role });
        await newUser.save();
        res.json({ message: "Success" });
    } catch (err) {
        // If error is code 11000, it's a duplicate user. Otherwise it's a server error.
        if (err.code === 11000) {
            res.status(400).json({ message: "User already exists" });
        } else {
            console.error("Register Error:", err); // Look at server logs for real error
            res.status(500).json({ message: "Server Error: Could not register" });
        }
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.json({ message: "Success", user });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json({ message: "Login Error" });
    }
});

// Add Money
app.post('/add-funds', async (req, res) => {
    try {
        const { email, amount } = req.body;
        const user = await User.findOneAndUpdate(
            { email }, 
            { $inc: { wallet: amount } }, 
            { new: true }
        );
        res.json({ success: true, newBalance: user.wallet });
    } catch (err) {
        res.status(500).json({ message: "Error adding funds" });
    }
});

// Upload Course
app.post('/add-course', async (req, res) => {
    try {
        const { title, description, price, image, video, instructor } = req.body;
        const newCourse = new Course({ title, description, price, image, video, instructor });
        await newCourse.save();
        res.json({ success: true, message: "Course Created!" });
    } catch (err) {
        res.status(500).json({ message: "Error saving course" });
    }
});

// Get Courses
app.get('/courses', async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: "Error fetching courses" });
    }
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));