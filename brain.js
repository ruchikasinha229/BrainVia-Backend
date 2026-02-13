import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

// 👇 YOUR DATABASE LINK
const MONGO_URI = "mongodb+srv://admin:admin123@cluster0.mongodb.net/udemyclone?retryWrites=true&w=majority"; 

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
        res.status(400).json({ message: "User already exists" });
    }
});

// Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) {
        res.json({ message: "Success", user });
    } else {
        res.status(400).json({ message: "Invalid credentials" });
    }
});

// Add Money (New!)
app.post('/add-funds', async (req, res) => {
    const { email, amount } = req.body;
    const user = await User.findOneAndUpdate(
        { email }, 
        { $inc: { wallet: amount } }, 
        { new: true }
    );
    res.json({ success: true, newBalance: user.wallet });
});

// Upload Course (New!)
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
    const courses = await Course.find();
    res.json(courses);
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));