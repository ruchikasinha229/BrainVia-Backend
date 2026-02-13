import { useState } from 'react';
import axios from 'axios';

export default function AddCourse({ user, onBack }) {
    const [course, setCourse] = useState({
        title: '', description: '', price: '', image: '', video: ''
    });

    const handleChange = (e) => {
        setCourse({ ...course, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://brainvia-backend.onrender.com/add-course', {
                ...course,
                price: Number(course.price),
                instructor: user.email
            });
            alert("✅ Course Uploaded Successfully!");
            onBack();
        } catch (err) {
            alert("❌ Error uploading course");
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto' }}>
            <h2>📹 Upload New Course</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input name="title" placeholder="Course Title" onChange={handleChange} required style={{padding: '10px'}} />
                <textarea name="description" placeholder="Description" onChange={handleChange} required style={{padding: '10px'}} />
                <input name="price" type="number" placeholder="Price (₹)" onChange={handleChange} required style={{padding: '10px'}} />
                <input name="image" placeholder="Image URL (Thumbnail)" onChange={handleChange} required style={{padding: '10px'}} />
                <input name="video" placeholder="Video URL (YouTube Embed Link)" onChange={handleChange} required style={{padding: '10px'}} />
                
                <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    🚀 Publish Course
                </button>
                <button type="button" onClick={onBack} style={{ padding: '10px', background: '#666', color: 'white', border: 'none', cursor: 'pointer', marginTop: '5px' }}>
                    Cancel
                </button>
            </form>
        </div>
    );
}