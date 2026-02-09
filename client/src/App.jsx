import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Instructor from './Instructor';
import Classroom from './Classroom';
import './App.css'; 

function App() {
  const [currentPage, setCurrentPage] = useState('home'); 
  const [user, setUser] = useState(null); 
  const [courses, setCourses] = useState([]); 
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // NEW: State for the Payment Popup
  const [showPayment, setShowPayment] = useState(false);
  const [courseToBuy, setCourseToBuy] = useState(null);

  useEffect(() => { fetchCourses(); }, []);

  const fetchCourses = async () => {
    try {
        // 👇 UPDATED TO CLOUD URL
        const res = await axios.get('https://brainvia-backend.onrender.com/courses');
        setCourses(res.data);
    } catch(err) { console.error(err); }
  };

  const handleLogin = (userData) => { setUser(userData); setCurrentPage('home'); };
  const handleLogout = () => { setUser(null); setCurrentPage('login'); };

  // 1. User Clicks "Buy Now" -> We just open the popup
  const initiateBuy = (course) => {
    if (!user) {
        alert("Please Login to Buy");
        setCurrentPage('login');
        return;
    }
    setCourseToBuy(course);
    setShowPayment(true);
  };

  // 2. User Clicks "Pay ₹500" inside the popup -> We process it
  const processPayment = async () => {
    try {
        // 👇 UPDATED TO CLOUD URL
        const res = await axios.post('https://brainvia-backend.onrender.com/buy', {
            userId: user._id,
            courseId: courseToBuy._id
        });
        
        // Success!
        alert("✅ Payment Successful! Receipt sent to email.");
        setUser(res.data.updatedUser); 
        setShowPayment(false); // Close popup
        setCourseToBuy(null);
    } catch (err) {
        alert("❌ Payment Failed. Try again.");
    }
  };

  const openCourse = (course) => {
    if (!user) {
        alert("Please Login to see details");
        setCurrentPage('login');
        return;
    }

    const isInstructor = user.role === 'instructor';
    const hasBought = user.purchasedCourses && user.purchasedCourses.includes(course._id);

    if (isInstructor || hasBought) {
        setSelectedCourse(course);
        setCurrentPage('classroom');
    } else {
        initiateBuy(course); // Open the new payment form
    }
  };

  return (
    <div className="app-container">
      {/* Navbar */}
      <nav style={styles.nav}>
        <h1 onClick={() => setCurrentPage('home')} style={styles.logo}>BrainVia</h1>
        <div>
          {user ? (
            <>
              <span style={{marginRight: '15px', color: '#ffc107'}}> 
                 {user.role === 'instructor' ? `💰 Wallet: ₹${user.wallet || 0}` : `👤 ${user.email}`}
              </span>
              {user.role === 'instructor' && (
                <button onClick={() => setCurrentPage('instructor')} style={styles.navButton}>Instructor Mode</button>
              )}
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </>
          ) : (
            <button onClick={() => setCurrentPage('login')} style={styles.navButton}>Login</button>
          )}
        </div>
      </nav>

      {/* Main Grid */}
      {currentPage === 'home' && (
        <div style={styles.grid}>
          {courses.map(course => {
            const isUnlocked = user && (user.role === 'instructor' || (user.purchasedCourses && user.purchasedCourses.includes(course._id)));
            return (
              <div key={course._id} style={styles.card}>
                {course.image && course.image.includes('youtube') ? (
                   <iframe width="100%" height="200" src={course.image} frameBorder="0"></iframe>
                ) : (
                   <img src={course.image || 'https://via.placeholder.com/300'} alt={course.title} style={styles.image} />
                )}
                <div style={{padding: '15px'}}>
                  <h3>{course.title}</h3>
                  <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'10px'}}>
                      <span style={{fontWeight: 'bold', fontSize:'18px'}}>₹{course.price}</span>
                      {isUnlocked ? (
                          <button onClick={() => openCourse(course)} style={styles.startBtn}>▶ Start Learning</button>
                      ) : (
                          <button onClick={() => openCourse(course)} style={styles.buyBtn}>🛒 Buy Now</button>
                      )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* PAYMENT MODAL (The New Fake Checkout) */}
      {showPayment && courseToBuy && (
          <div style={styles.modalOverlay}>
              <div style={styles.modalContent}>
                  <h3>💳 Secure Checkout</h3>
                  <p>Buying: <strong>{courseToBuy.title}</strong></p>
                  <p style={{fontSize:'24px', fontWeight:'bold', margin:'10px 0'}}>Total: ₹{courseToBuy.price}</p>
                  
                  <div style={{textAlign:'left', marginTop:'20px'}}>
                      <label>Card Number</label>
                      <input placeholder="4242 4242 4242 4242" style={styles.input} />
                      
                      <div style={{display:'flex', gap:'10px', marginTop:'10px'}}>
                          <input placeholder="MM/YY" style={styles.input} />
                          <input placeholder="CVV" style={styles.input} />
                      </div>
                  </div>

                  <div style={{marginTop:'20px', display:'flex', gap:'10px'}}>
                      <button onClick={processPayment} style={styles.payBtn}>Pay Now</button>
                      <button onClick={() => setShowPayment(false)} style={styles.cancelBtn}>Cancel</button>
                  </div>
                  <p style={{fontSize:'12px', color:'#666', marginTop:'10px'}}>🔒 128-bit SSL Encrypted</p>
              </div>
          </div>
      )}

      {currentPage === 'login' && <Login onLogin={handleLogin} onSwitch={() => setCurrentPage('register')} />}
      {currentPage === 'register' && <Register onRegister={() => setCurrentPage('login')} onSwitch={() => setCurrentPage('login')} />}
      {currentPage === 'instructor' && <Instructor user={user} />}
      {currentPage === 'classroom' && selectedCourse && <Classroom course={selectedCourse} onBack={() => setCurrentPage('home')} />}
    </div>
  );
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', padding: '20px', backgroundColor: '#2d3436', color: 'white', alignItems: 'center' },
  logo: { cursor: 'pointer', margin: 0, fontWeight: 'bold' },
  navButton: { padding: '8px 15px', marginRight: '10px', cursor: 'pointer', borderRadius: '4px', border:'none' },
  logoutBtn: { padding: '8px 15px', backgroundColor: '#d63031', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px', padding: '40px', maxWidth: '1200px', margin: '0 auto' },
  card: { border: '1px solid #dfe6e9', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', background: 'white' },
  image: { width: '100%', height: '200px', objectFit: 'cover' },
  buyBtn: { padding: '10px 20px', backgroundColor: '#0984e3', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' },
  startBtn: { padding: '10px 20px', backgroundColor: '#00b894', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px', fontWeight: 'bold' },
  
  // NEW STYLES FOR PAYMENT MODAL
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { backgroundColor: 'white', padding: '30px', borderRadius: '15px', width: '350px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' },
  input: { width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '5px' },
  payBtn: { flex: 2, padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' },
  cancelBtn: { flex: 1, padding: '12px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default App;