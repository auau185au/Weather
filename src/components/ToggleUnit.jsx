import React from 'react';

function ToggleUnit({ unit, onToggle }) {
  return (
    <div className="toggle-unit">
      <button
        className={unit === 'celsius' ? 'active' : ''}
        onClick={() => unit !== 'celsius' && onToggle()}
      >
        °C
      </button>
      <button
        className={unit === 'fahrenheit' ? 'active' : ''}
        onClick={() => unit !== 'fahrenheit' && onToggle()}
      >
        °F
      </button>
    </div>
  );
}

export default ToggleUnit;