import { useState } from 'react';
import { generateQuestions, getModelAnswer, getSessionDetail } from './api';
import './App.css';

import History from './History';

function App() {
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showHistory, setShowHistory] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    const data = await generateQuestions(role, 'Intermediate');
    setQuestions(data);
    setShowHistory(false);
    setLoading(false);
  };

  const handleShowAnswer = async (question) => {
    setSelectedAnswer("AI පිළිතුර සූදානම් කරමින් පවතී...");
    const answer = await getModelAnswer(question);
    setSelectedAnswer(answer);
  };

  const handleSelectSession = async (sessionId) => {
  setLoading(true);
  const data = await getSessionDetail(sessionId);
  setQuestions(data.map(q => ({
      id: q.id,
      question: q.question_text,
      topic: q.topic
  })));
  setLoading(false);
  };

  return (
    <div className="App">
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

      {showHistory && (
          <History onSelectSession={handleSelectSession} />
      )}

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
    </div>
  );
}

export default App;