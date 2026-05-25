import React from 'react';

function WeatherCard({ data, temp, unit }) {
  const weather = data.weather[0];
  return (
    <div className="weather-card">
      <h2>{data.name}</h2>
      <div className="weather-icon" style={{ fontSize: '3rem' }}>{weather.icon}</div>
      <p className="temp">{temp}</p>
      <p className="desc">{weather.description}</p>
      <div className="details">
        <span>💧 湿度：{data.main.humidity}%</span>
        <span>🌬️ 风速：{data.wind.speed} m/s</span>
      </div>
    </div>
  );
}

export default WeatherCard;