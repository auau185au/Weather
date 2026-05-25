import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import HistoryList from './components/HistoryList';
import ToggleUnit from './components/ToggleUnit';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('celsius');
  const [history, setHistory] = useState([]);


 const fetchWeather = useCallback(async (searchCity) => {
  if (!searchCity) return;
  setLoading(true);
  setError('');
  try {
    // 高德地理编码请求
    const geoUrl = `/api-amap/v3/geocode/geo?address=${encodeURIComponent(searchCity)}&key=${import.meta.env.VITE_AMAP_KEY}`;
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();

    if (geoData.status !== '1' || !geoData.geocodes || geoData.geocodes.length === 0) {
      throw new Error(`未找到城市“${searchCity}”，请尝试更准确的名字（如“北京市”）`);
    }

    const { location, formatted_address } = geoData.geocodes[0];
    const [longitude, latitude] = location.split(',');

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`;
    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    const current = weatherData.current_weather;

    // 提取湿度
    let humidity = null;
    if (weatherData.hourly && weatherData.hourly.time && weatherData.hourly.relativehumidity_2m) {
      const now = new Date();
      const currentHour = now.toISOString().slice(0, 13) + ':00';
      const idx = weatherData.hourly.time.findIndex(t => t === currentHour);
      if (idx !== -1) humidity = weatherData.hourly.relativehumidity_2m[idx];
      else humidity = weatherData.hourly.relativehumidity_2m[0];
    }

    // ========== 天气图标映射（根据 Open-Meteo 官方文档） ==========
    const getWeatherInfo = (code) => {
      // 晴
      if (code === 0) return { desc: '晴', icon: '☀️' };
      // 主要晴
      if (code === 1) return { desc: '大部晴朗', icon: '🌤️' };
      // 部分多云
      if (code === 2) return { desc: '局部多云', icon: '⛅' };
      // 多云
      if (code === 3) return { desc: '阴天', icon: '☁️' };
      // 雾
      if (code >= 45 && code <= 48) return { desc: '雾', icon: '🌫️' };
      // 毛毛雨
      if (code >= 51 && code <= 55) return { desc: '毛毛雨', icon: '🌦️' };
      // 雨
      if (code >= 61 && code <= 65) return { desc: '雨', icon: '🌧️' };
      // 雪
      if (code >= 71 && code <= 77) return { desc: '雪', icon: '❄️' };
      // 阵雨
      if (code >= 80 && code <= 82) return { desc: '阵雨', icon: '🌧️' };
      // 雷暴
      if (code >= 95 && code <= 99) return { desc: '雷阵雨', icon: '⛈️' };
      // 默认
      return { desc: '未知', icon: '❓' };
    };

    const { desc, icon } = getWeatherInfo(current.weathercode);
    // ============================================================

    setWeatherData({
      name: formatted_address.split(',')[0],
      sys: { country: '' },
      main: { temp: current.temperature, humidity: humidity ?? 0 },
      weather: [{ description: desc, icon: icon }],
      wind: { speed: current.windspeed }
    });

    setHistory(prev => {
      const newHistory = [searchCity, ...prev.filter(c => c !== searchCity)];
      return newHistory.slice(0, 3);
    });
  } catch (err) {
    setError(err.message);
    setWeatherData(null);
  } finally {
    setLoading(false);
  }
}, []);


  // 初始化时从 localStorage 读取历史
  useEffect(() => {
    const savedHistory = localStorage.getItem('weatherHistory');
    if (savedHistory) {
      const parsed = JSON.parse(savedHistory);
      setHistory(parsed);
      if (parsed.length > 0) {
        fetchWeather(parsed[0]);
      }
    }
  }, [fetchWeather]);

  // 保存历史到 localStorage
  useEffect(() => {
    localStorage.setItem('weatherHistory', JSON.stringify(history));
  }, [history]);

  // 缓存温度转换
  const displayTemp = useMemo(() => {
    if (!weatherData) return null;
    const celsius = weatherData.main.temp;
    if (unit === 'celsius') return `${Math.round(celsius)}°C`;
    const fahrenheit = (celsius * 9 / 5) + 32;
    return `${Math.round(fahrenheit)}°F`;
  }, [weatherData, unit]);

  const handleSearch = useCallback((searchCity) => {
    if (searchCity.trim()) fetchWeather(searchCity.trim());
  }, [fetchWeather]);

  const toggleUnit = useCallback(() => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  }, []);

  return (
    <div className="app-container">
      <h1>实时天气看板</h1>
      <SearchBar onSearch={handleSearch} />
      <ToggleUnit unit={unit} onToggle={toggleUnit} />
      {loading && <div className="info">加载中...</div>}
      {error && <div className="info error">{error}</div>}
      {weatherData && (
        <WeatherCard data={weatherData} temp={displayTemp} unit={unit} />
      )}
      <HistoryList history={history} onSelect={handleSearch} />
    </div>
  );
}

export default App;