import { useState } from 'react';
import { askAI } from './api';
import './App.css';

function App() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const data = await askAI(prompt);
      setResponse(data.ai_response);
    } catch (err) {
      setResponse("❌ වැරදීමක් සිදු විය. කරුණාකර නැවත උත්සාහ කරන්න.");
    }

    setLoading(false);
  };

  return (
    <div className="app-container">

      <div className="card">
        <h1>AI Career Catalyst 🚀</h1>
        <p className="subtitle">ඔයාගේ career ප්‍රශ්න මගෙන් අහන්න</p>

        <form onSubmit={handleSubmit}>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="ඔයාගේ ප්‍රශ්නය මෙතන Type කරන්න..."
            rows="4"
          />

          <button type="submit" disabled={loading}>
            {loading ? "🤖 AI එක හිතන ගමන්..." : "AI එකෙන් අහන්න"}
          </button>
        </form>

        {response && (
          <div className="response-box">
            <h3>ඔයාගේ පිළිතුර</h3>
            <p>{response}</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default App;