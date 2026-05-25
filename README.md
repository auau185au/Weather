# 实时天气看板

基于 React + Vite 的天气查询应用，支持城市中文搜索、实时天气数据展示、温度单位切换、搜索历史记录。

## 功能特点

- 🔍 **城市搜索**：支持中文城市名（如“北京”），调用高德地理编码 API 转换为经纬度
- 🌤️ **实时天气**：显示温度、湿度、风速、天气状况（晴/雨/雪等）
- 🌡️ **温度单位切换**：摄氏度 / 华氏度
- 📜 **搜索历史**：自动保存最近 3 条搜索记录（localStorage）
- 📱 **响应式设计**：适配 PC 端和移动端

## 技术栈

- **前端框架**：React 19 + Hooks
- **构建工具**：Vite
- **地理编码**：高德地图 Web 服务 API
- **天气数据**：Open-Meteo 免费 API
- **样式**：原生 CSS（Flex/Grid）
- **部署**：Vercel / Netlify

## 本地运行

### 前提条件

- Node.js 18+ 和 npm
- 高德地图 API Key

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/auau185au/weather-dashboard.git
   cd weather-dashboard
   ```
2. 安装依赖
```bash
npm install
```
3. 配置环境变量
4. 启动开发服务器
```bash
npm run dev
```
 
 # 项目结构
weather-dashboard/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx       # 搜索输入框
│   │   ├── WeatherCard.jsx     # 天气信息卡片
│   │   ├── HistoryList.jsx     # 搜索历史列表
│   │   └── ToggleUnit.jsx      # 温度单位切换按钮
│   ├── App.jsx                 # 主组件，状态管理与 API 调用
│   ├── App.css                 # 样式
│   ├── main.jsx                # 入口文件
│   └── index.css               # 全局样式
├── index.html
├── package.json
├── vite.config.ts              # Vite 代理配置（解决 CORS）
└── .env                        # 环境变量（需自行创建）