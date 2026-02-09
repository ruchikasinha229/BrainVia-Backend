import { useState } from 'react';

export default function Classroom({ course, onBack }) {
    const [activeTab, setActiveTab] = useState('lectures'); // 'lectures', 'test', 'marathon'
    
    // Default to the first video if available
    const [currentVideo, setCurrentVideo] = useState(
        course.syllabus && course.syllabus.length > 0 ? course.syllabus[0].videoUrl : ''
    );
    const [currentTopic, setCurrentTopic] = useState(
        course.syllabus && course.syllabus.length > 0 ? course.syllabus[0].topic : 'No Content'
    );

    // Quiz State
    const [answers, setAnswers] = useState({});
    const [score, setScore] = useState(null);

    // If the course has no syllabus, handle it gracefully
    if (!course.syllabus || course.syllabus.length === 0) {
        return <div style={{padding:'20px'}}><button onClick={onBack}>Back</button><h3>No content uploaded yet!</h3></div>;
    }

    const handleQuizSubmit = () => {
        let correctCount = 0;
        course.quiz.forEach((q, index) => {
            // Compare user answer (index) with correct answer (index)
            if (answers[index] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore(correctCount);
    };

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <button onClick={onBack} style={styles.backBtn}>← Back to Dashboard</button>
                <h2>{course.title}</h2>
            </div>

            <div style={styles.contentArea}>
                {/* VIDEO PLAYER SECTION */}
                <div style={styles.videoSection}>
                    {activeTab === 'marathon' ? (
                         course.marathonUrl ? (
                            <iframe width="100%" height="450" src={course.marathonUrl} frameBorder="0" allowFullScreen></iframe>
                         ) : <h3>🔴 No Live Marathon Currently Active</h3>
                    ) : (
                        /* 👇 THIS IS THE NEW SMART PLAYER (Hides YouTube Logo/Links) 👇 */
                        <iframe 
                            width="100%" 
                            height="450" 
                            src={`${currentVideo}?modestbranding=1&rel=0&showinfo=0&controls=1`} 
                            title="Lesson Video"
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                    )}
                    
                    <h3>{activeTab === 'marathon' ? "🔴 Live Session" : `📺 ${currentTopic}`}</h3>
                </div>

                {/* SIDEBAR NAVIGATION */}
                <div style={styles.sidebar}>
                    <div style={styles.tabs}>
                        <button onClick={() => setActiveTab('lectures')} style={activeTab === 'lectures' ? styles.activeTab : styles.tab}>Lectures</button>
                        <button onClick={() => setActiveTab('test')} style={activeTab === 'test' ? styles.activeTab : styles.tab}>Test Series</button>
                        <button onClick={() => setActiveTab('marathon')} style={activeTab === 'marathon' ? styles.activeTab : styles.tab}>🔴 Live</button>
                    </div>

                    <div style={styles.list}>
                        {/* TAB 1: LECTURES */}
                        {activeTab === 'lectures' && (
                            course.syllabus.map((item, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => { setCurrentVideo(item.videoUrl); setCurrentTopic(item.topic); }}
                                    style={currentVideo === item.videoUrl ? styles.activeItem : styles.item}
                                >
                                    ▶ {index + 1}. {item.topic}
                                </div>
                            ))
                        )}

                        {/* TAB 2: REAL QUIZ */}
                        {activeTab === 'test' && (
                            <div style={{padding: '15px'}}>
                                {(!course.quiz || course.quiz.length === 0) ? (
                                    <p>No questions added by instructor.</p>
                                ) : score === null ? (
                                    // SHOW QUESTIONS
                                    <>
                                        {course.quiz.map((q, i) => (
                                            <div key={i} style={{marginBottom:'20px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>
                                                <p style={{fontWeight:'bold'}}>Q{i+1}: {q.question}</p>
                                                {q.options.map((opt, oIndex) => (
                                                    <div key={oIndex} style={{marginBottom:'5px'}}>
                                                        <input 
                                                            type="radio" 
                                                            name={`question-${i}`} 
                                                            onChange={() => setAnswers({...answers, [i]: oIndex})} 
                                                        /> {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                        <button onClick={handleQuizSubmit} style={styles.submitBtn}>Submit Test</button>
                                    </>
                                ) : (
                                    // SHOW SCORE
                                    <div style={{textAlign:'center', padding:'20px', background:'#d4edda', borderRadius:'10px'}}>
                                        <h3>🎉 Test Completed!</h3>
                                        <h1>You scored: {score} / {course.quiz.length}</h1>
                                        <button onClick={() => setScore(null)} style={{marginTop:'10px', padding:'5px 10px'}}>Retake Test</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: { height: '100vh', display: 'flex', flexDirection: 'column' },
    header: { padding: '15px 30px', background: '#2d3436', color: 'white', display: 'flex', alignItems: 'center', gap: '20px' },
    backBtn: { background: 'transparent', color: 'white', border: '1px solid white', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' },
    contentArea: { display: 'flex', flex: 1 },
    videoSection: { flex: 3, background: 'black', padding: '0' }, // Video takes 75% width
    sidebar: { flex: 1, borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', background: '#f9f9f9' },
    tabs: { display: 'flex', borderBottom: '1px solid #ddd' },
    tab: { flex: 1, padding: '15px', border: 'none', background: '#f1f1f1', cursor: 'pointer' },
    activeTab: { flex: 1, padding: '15px', border: 'none', background: 'white', borderBottom: '3px solid #00b894', fontWeight: 'bold' },
    list: { padding: '0', overflowY: 'auto', flex: 1 },
    item: { padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', fontSize: '14px' },
    activeItem: { padding: '15px', borderBottom: '1px solid #eee', cursor: 'pointer', background: '#e0f7fa', fontWeight: 'bold', color: '#006064' },
    submitBtn: { width: '100%', padding: '10px', background: '#00b894', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }
};