import { Router } from 'express';
import { createItem, listItems, getItem, updateItem, deleteItem } from '../controllers/itemController.js';

const itemRouter = Router();

// TODO: 과제에서 아래 5개 엔드포인트 연결
itemRouter.post('/', createItem);
itemRouter.get('/', listItems);
itemRouter.get('/:id', getItem);
itemRouter.put('/:id', updateItem);
itemRouter.delete('/:id', deleteItem);

export default itemRouter;
