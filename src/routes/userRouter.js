import { Router } from "express";
import { getUsers, createUser } from "../controllers/userController.js";

const userRouter = Router(); 

// http://localhost:3000/users/ << 이 뒤에 아무것도 안붙는다는 뜻
userRouter.get('/', getUsers); // controller로 분리
userRouter.post('/', createUser);

export default userRouter;