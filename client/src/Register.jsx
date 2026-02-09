import { useState } from 'react';
import axios from 'axios';

export default function Register({ onRegister, onSwitch }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 👇 UPDATED: Talking to the Cloud Brain now!
            await axios.post('https://brainvia-backend.onrender.com/register', {
                email, 
                password, 
                role
            });
            
            // Success!
            alert('🎉 Registration Successful! Please Log In.');
            onRegister(); // Switch to Login screen automatically
        } catch (err) {
            console.error(err);
            alert('Error: ' + (err.response?.data?.message || "Registration Failed"));
        }
    };

    return (
        <div style={{maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)', textAlign: 'center'}}>
            <h2>🚀 Join BrainVia</h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                
                <input 
                    placeholder="Email Address" 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    style={{padding: '12px', borderRadius: '5px', border: '1px solid #ccc'}} 
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                    style={{padding: '12px', borderRadius: '5px', border: '1px solid #ccc'}} 
                />
                
                <select 
                    value={role} 
                    onChange={e => setRole(e.target.value)} 
                    style={{padding: '12px', borderRadius: '5px', border: '1px solid #ccc'}}
                >
                    <option value="student">I am a Student</option>
                    <option value="instructor">I am an Instructor</option>
                </select>
                
                <button type="submit" style={{padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold'}}>
                    Sign Up
                </button>
            </form>
            
            <p style={{marginTop: '20px'}}>
                Already have an account? 
                <span onClick={onSwitch} style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline'}}>
                    Log In
                </span>
            </p>
        </div>
    );
}