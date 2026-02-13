import { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import AddCourse from './AddCourse';
import axios from 'axios';

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState('login');
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (page === 'dashboard') {
      axios.get('https://brainvia-backend.onrender.com/courses')
        .then(res => setCourses(res.data))
        .catch(err => console.error(err));
    }
  }, [page]);

  const addFunds = async () => {
    try {
      const amount = prompt("Enter amount to add (₹):", "500");
      if (!amount) return;
      
      const res = await axios.post('https://brainvia-backend.onrender.com/add-funds', {
        email: user.email,
        amount: Number(amount)
      });
      
      setUser({ ...user, wallet: res.data.newBalance });
      alert(`✅ Added ₹${amount}! New Balance: ₹${res.data.newBalance}`);
    } catch (err) {
      alert("Error adding funds");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
      
      {page === 'login' && (
        <Login onLogin={(u) => { setUser(u); setPage('dashboard'); }} onSwitch={() => setPage('register')} />
      )}

      {page === 'register' && (
        <Register onRegister={() => setPage('login')} onSwitch={() => setPage('login')} />
      )}

      {page === 'add-course' && (
        <AddCourse user={user} onBack={() => setPage('dashboard')} />
      )}

      {page === 'dashboard' && user && (
        <div>
          <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '10px', background: '#f8f9fa' }}>
            <h2>🎓 BrainVia</h2>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
              
              <span>💰 ₹{user.wallet}</span>
              <button onClick={addFunds} style={{ background: '#ffc107', border: 'none', padding: '5px 10px', cursor: 'pointer', borderRadius: '5px' }}>
                + Add Money
              </button>

              {user.role === 'instructor' && (
                <button onClick={() => setPage('add-course')} style={{ background: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                  📹 Upload Course
                </button>
              )}
              
              <button onClick={() => { setUser(null); setPage('login'); }} style={{ background: 'red', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
                Logout
              </button>
            </div>
          </nav>

          <h3>Available Courses</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {courses.map(course => (
              <div key={course._id} style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <img src={course.image} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' }} />
                <h3>{course.title}</h3>
                <p>{course.description}</p>
                <p style={{ fontWeight: 'bold', color: '#28a745' }}>₹{course.price}</p>
                <button style={{ width: '100%', padding: '10px', background: '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;