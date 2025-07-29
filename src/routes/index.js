import express, { Router } from 'express';
import userRouter from './userRouter.js';
import productRouter from './productRouter.js';

// 라우터 : 클라이언트의 요청 URL과 메서드(GET, POST 등)에 따라 어떤 로직을 실행할지 결정하는 시스템
const router = Router(); // 라우트를 다른 모듈로 분리할 때 사용 (app.js에 바로 라우트 작성할 때는 필요 없음)

router.use('/users', userRouter);
// 다른 라우터를 추가할 수 있습니다.
router.use('/product', productRouter);

export default router;