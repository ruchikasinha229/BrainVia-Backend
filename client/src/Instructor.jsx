import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Instructor({ user }) {
    // Check for updated wallet balance
    const [earnings, setEarnings] = useState(0);

    // Form Data
    const [formData, setFormData] = useState({
        title: '', description: '', price: '', image: '', marathonUrl: ''
    });

    const [syllabus, setSyllabus] = useState([{ topic: '', videoUrl: '' }]);
    
    // QUIZ BUILDER STATE
    const [quiz, setQuiz] = useState([
        { question: '', options: ['','','',''], correctAnswer: 0 }
    ]);

    // Fetch latest earnings on load
    useEffect(() => {
        if(user) {
            axios.get(`http://localhost:5000/user/${user._id}`)
                 .then(res => setEarnings(res.data.wallet || 0));
        }
    }, [user]);

    // --- HANDLERS ---
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleSyllabus = (index, e) => {
        const newSyl = [...syllabus];
        newSyl[index][e.target.name] = e.target.value;
        setSyllabus(newSyl);
    };

    // Quiz Handlers (The Magic Logic 🪄)
    const handleQuizQuestion = (index, val) => {
        const newQuiz = [...quiz];
        newQuiz[index].question = val;
        setQuiz(newQuiz);
    };

    const handleQuizOption = (qIndex, oIndex, val) => {
        const newQuiz = [...quiz];
        newQuiz[qIndex].options[oIndex] = val;
        setQuiz(newQuiz);
    };

    const handleCorrectAnswer = (qIndex, val) => {
        const newQuiz = [...quiz];
        newQuiz[qIndex].correctAnswer = parseInt(val);
        setQuiz(newQuiz);
    };

    const addChapter = () => setSyllabus([...syllabus, { topic: '', videoUrl: '' }]);
    const addQuestion = () => setQuiz([...quiz, { question: '', options: ['','','',''], correctAnswer: 0 }]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalCourse = {
            ...formData,
            instructorEmail: user.email, // Link course to YOU so you get paid
            syllabus,
            quiz
        };
        try {
            await axios.post('http://localhost:5000/courses', finalCourse);
            alert('🎉 Course Published! Students can now buy it.');
            // Clear form
            setFormData({ title: '', description: '', price: '', image: '', marathonUrl: '' });
        } catch (err) {
            alert('Error publishing');
        }
    };

    return (
        <div style={{padding: '40px', maxWidth: '800px', margin: '0 auto'}}>
            {/* 💰 WALLET SECTION */}
            <div style={{padding: '20px', background: '#d4edda', borderRadius: '10px', marginBottom: '20px', border: '1px solid #c3e6cb'}}>
                <h2 style={{margin:0, color: '#155724'}}>💰 Your Wallet: ₹{earnings.toFixed(2)}</h2>
                <p style={{margin:0, color: '#155724'}}>You earn 70% of every sale! (Platform fee: 30%)</p>
            </div>

            <h2>📝 Create New Course</h2>
            <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'15px'}}>
                
                {/* Basic Info */}
                <input name="title" placeholder="Course Title" onChange={handleChange} style={styles.input} required />
                <textarea name="description" placeholder="Description" onChange={handleChange} style={styles.input} />
                <input name="price" type="number" placeholder="Price (₹)" onChange={handleChange} style={styles.input} required />
                <input name="image" placeholder="Image/Video URL (YouTube Embed)" onChange={handleChange} style={styles.input} />

                {/* Syllabus */}
                <h3>📚 Syllabus (Lectures)</h3>
                {syllabus.map((item, i) => (
                    <div key={i} style={styles.row}>
                        <span style={{fontWeight:'bold'}}>#{i+1}</span>
                        <input placeholder="Topic Title" value={item.topic} onChange={(e)=>handleSyllabus(i, e)} name="topic" style={styles.input} />
                        <input placeholder="Video URL (Embed)" value={item.videoUrl} onChange={(e)=>handleSyllabus(i, e)} name="videoUrl" style={styles.input} />
                    </div>
                ))}
                <button type="button" onClick={addChapter} style={styles.addBtn}>+ Add Chapter</button>

                {/* Quiz Builder */}
                <h3>❓ Quiz Builder</h3>
                {quiz.map((q, i) => (
                    <div key={i} style={{border:'1px solid #ccc', padding:'15px', borderRadius:'8px', background: '#f9f9f9'}}>
                        <input placeholder={`Question ${i+1}`} value={q.question} onChange={(e)=>handleQuizQuestion(i, e.target.value)} style={{...styles.input, width:'96%', marginBottom:'10px', fontWeight:'bold'}} />
                        
                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                            {q.options.map((opt, oIndex) => (
                                <input key={oIndex} placeholder={`Option ${oIndex+1}`} value={opt} onChange={(e)=>handleQuizOption(i, oIndex, e.target.value)} style={styles.input} />
                            ))}
                        </div>
                        
                        <div style={{marginTop:'10px'}}>
                            <label>Correct Answer (1-4): </label>
                            <input type="number" min="1" max="4" onChange={(e)=>handleCorrectAnswer(i, e.target.value - 1)} style={{width:'60px', padding:'5px'}} />
                        </div>
                    </div>
                ))}
                <button type="button" onClick={addQuestion} style={styles.addBtn}>+ Add Question</button>

                {/* Live Events */}
                <h3>🔴 Live Marathon (Optional)</h3>
                <input name="marathonUrl" placeholder="Live Stream URL" onChange={handleChange} style={styles.input} />

                {/* Submit */}
                <button type="submit" style={styles.submitBtn}>🚀 Publish & Start Earning</button>
            </form>
        </div>
    );
}

const styles = {
    input: { padding: '10px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 },
    row: { display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' },
    addBtn: { padding: '8px', background: '#e2e6ea', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' },
    submitBtn: { padding: '15px', background: '#28a745', color: 'white', border: 'none', fontSize: '18px', cursor: 'pointer', marginTop: '20px', borderRadius: '5px' }
};