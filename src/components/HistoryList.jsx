import React from 'react';

function HistoryList({ history, onSelect }) {
  if (history.length === 0) return null;
  return (
    <div className="history">
      <h3>最近搜索</h3>
      <div className="history-buttons">
        {history.map((city, idx) => (
          <button key={idx} onClick={() => onSelect(city)}>
            {city}
          </button>
        ))}
      </div>
    </div>
  );
}

export default HistoryList;