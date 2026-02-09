import { useState } from 'react';
import axios from 'axios';

export default function Login({ onLogin, onSwitch }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 👇 UPDATED: Talking to the Cloud Brain now!
            const res = await axios.post('https://brainvia-backend.onrender.com/login', { email, password });
            
            // If Brain says "Success", log them in
            if (res.data.message === "Success") {
                alert("✅ Login Successful!");
                onLogin(res.data.user); 
            }
        } catch (err) {
            alert("❌ Invalid Email or Password");
        }
    };

    return (
        <div style={{maxWidth: '400px', margin: '50px auto', padding: '30px', border: '1px solid #ddd', borderRadius: '10px', textAlign: 'center', boxShadow: '0 4px 8px rgba(0,0,0,0.1)'}}>
            <h2>🔑 Log In to BrainVia</h2>
            
            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                <input 
                    placeholder="Email" 
                    type="email" 
                    onChange={e => setEmail(e.target.value)} 
                    style={{padding: '12px', borderRadius: '5px', border: '1px solid #ccc'}}
                />
                <input 
                    placeholder="Password" 
                    type="password" 
                    onChange={e => setPassword(e.target.value)} 
                    style={{padding: '12px', borderRadius: '5px', border: '1px solid #ccc'}}
                />
                <button type="submit" style={{padding: '12px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px'}}>
                    Log In
                </button>
            </form>
            
            <p style={{marginTop: '20px'}}>
                Don't have an account? 
                <span 
                    onClick={onSwitch} 
                    style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold', marginLeft: '5px', textDecoration: 'underline'}}
                >
                    Sign up
                </span>
            </p>
        </div>
    );
}