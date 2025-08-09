import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  replaceUser,
 // updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.get('/',      getAllUsers);    // GET    /users
router.get('/:id',   getUserById);    // GET    /users/:id (:id는 동적으로 변하는 부분)
router.post('/',     createUser);     // POST   /users
router.put('/:id',   replaceUser);    // PUT    /users/:id
//router.patch('/:id', updateUser);     // PATCH  /users/:id
router.delete('/:id', deleteUser);    // DELETE /users/:id

export default router;
