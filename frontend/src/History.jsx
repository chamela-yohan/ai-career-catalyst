import { useEffect, useState } from 'react';
import { getHistory } from './api';
import './History.css';

function History({ onSelectSession }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  return (
    <div className="history-section">
      <h3>පෙර සම්මුඛ පරීක්ෂණ (History)</h3>
      {history.length === 0 ? <p>තවම Data කිසිවක් නැත.</p> : (
        <ul>
          {history.map((item) => (
            <li key={item.id} onClick={() => onSelectSession(item.id)}>
              <strong>{item.job_role}</strong> <br />
              <small>{new Date(item.created_at).toLocaleDateString()} | {item.question_count} Questions</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default History;