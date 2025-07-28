import express from 'express';
import dayjs from 'dayjs';

const app = express();
const PORT = process.env.PORT || 3000;

// 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// JSON 응답 예시 req, res 라우트 핸들러 (함수형)
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: Date.now() });
});

// 과제1
app.get('/hello', (req, res) => {
  res.status(200).json({ status: '안녕하세요, Express!'});
});

// 과제2
app.get('/api/time', (req, res) => {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  res.json({ time: now });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
