import { useState, useEffect } from 'react';
import { generateQuestions, getModelAnswer, getSessionDetail } from './api';

import {auth} from './firebase';// firebase config
import Auth from './Auth'; // Login component

import './App.css';

import History from './History';

function App() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showHistory, setShowHistory] = useState(false);

  const[user, setUser] = useState(null);

  useEffect(()=>{
    // Checked user login
    const unsubscribe = auth.onAuthStateChanged((currentUser)=>{
        setUser(currentUser);
        setLoading(false);
    });
    return ()=> unsubscribe();
  }, []);

  if (loading) return <div className='loader'>පද්ධතිය සූදානම් වෙමින් පවතී...</div>

  const handleGenerate = async () => {
  setLoading(true);
  try {
    const data = await generateQuestions(role, 'Intermediate', user);
    setQuestions(data.questions);
    setShowHistory(false);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // always runs(error තිබුනත්)
  }
};

  const handleShowAnswer = async (question) => {
    setSelectedAnswer("AI පිළිතුර සූදානම් කරමින් පවතී...");
    const answer = await getModelAnswer(question);
    setSelectedAnswer(answer);
  };

  const handleSelectSession = async (sessionId) => {
  setLoading(true);
  try {
    const data = await getSessionDetail(sessionId);
    setQuestions(data.map(q => ({
      id: q.id,
      question: q.question_text,
      topic: q.topic
    })));
  setLoading(false);
  }catch (err) {
    console.error(err);
  } finally {
    setLoading(false); // always runs(error තිබුනත්)
  }
  };

  return (
    <div className="App">
      {!user ? (
        <div className="login-page">
          <h1>AI Career Catalyst වෙත සාදරයෙන් පිළිගනිමු 🚀</h1>
          <p>ඉදිරියට යාමට කරුණාකර ඔබගේ Google ගිණුමෙන් ඇතුළු වන්න.</p>
          <Auth onUserChange={setUser} />
        </div>
      ): (


        <div className="dashboard">
          <header>
             <Auth onUserChange={setUser} /> {/* මෙතනදී Logout button එක පේනවා */}
          </header>
          
          <main>
              <h1>ඔයාගේ AI Interview Coach 🤖</h1>
              <input 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                placeholder="Job Role එක ඇතුළත් කරන්න (e.g. React Developer)"
              />
              <button onClick={handleGenerate} disabled={loading}>
                {loading ? "Generate වෙමින්..." : "ප්‍රශ්න ලබා ගන්න"}
              </button>

              <button style={{ marginLeft: '10px' }} onClick={() => setShowHistory(!showHistory)}>
                {showHistory ? "History Hide කරන්න" : "History බලන්න"}
              </button>

              <div className="questions-list">
                {questions.map((q) => (
                  <div key={q.id} className="question-card" onClick={() => handleShowAnswer(q.question)}>
                    <h4>{q.topic}</h4>
                    <p>{q.question}</p>
                  </div>
                ))}
              </div>

              {selectedAnswer && (
                <div className="answer-modal">
                  <h3>Model Answer:</h3>
                  <p>{selectedAnswer}</p>
                  <button onClick={() => setSelectedAnswer(null)}>Close</button>
                </div>
              )}

              <div className="main-content">
                {/* Question generation logic එක */}
              </div>
            
            {showHistory && <History onSelectSession={handleSelectSession} user={user} />}
          </main>
        </div>

      )}


      
    </div>
  );
}

export default App;