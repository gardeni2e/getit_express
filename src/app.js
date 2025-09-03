import express from 'express';
import dayjs from 'dayjs';
import router from './routes/index.js';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { delay } from './middlewares/delay.js';
import { logger } from './middlewares/logger.js';
import { errorHandler } from './middlewares/errorHandler.js';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // JSON 요청의 body를 자동으로 파싱하여 req.body에 객체로 저장

/* 기본 라우트
app.get('/', (req, res) => {
  res.send('Hello, World!');
});
*/

// JSON 응답 예시 req, res 라우트 핸들러 (함수형)
app.get('/api/status', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: Date.now() });
});

// 1차시 과제1
app.get('/hello', (req, res) => {
  res.status(200).json({ status: '안녕하세요, Express!'});
});

// 1차시 과제2
app.get('/api/time', (req, res) => {
  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  res.json({ time: now });
});

/*
// 2차시 쿼리 파라미터 실습
app.get('/', (req, res) => {
    const { active, page } = req.query; // 구조 분해 할당(객체)
    res.json({
        message: "유저 정보",
        filters: {
            active: active,
            page: page
        }
    });
});

// 2차시 바디 파라미터 실습 (post는 postman으로)
app.post('/', (req, res) => {
    const { name, email } = req.body;
    res.status(201).json({ // 리소스 생성 성공
        message: "유저가 생성되었습니다",
        data: {
            name: name,
            email: email
        }
    });
});
*/

app.use('/', router); // 모든 라우팅은 index.js가 담당 (이 코드 한 줄이면 끝)
app.use(cors());
app.use(morgan('tiny'));
app.use(helmet());

app.use(logger);
app.use(delay);
app.use(errorHandler);

app.get('/health', (req, res) => res.json({ ok: true, env: NODE_ENV }));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
