import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  replaceProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';

const router = express.Router();

router.get('/',      getAllProducts);    
router.get('/:id',   getProductById);    
router.post('/',     createProduct);     
router.put('/:id',   replaceProduct);    
router.patch('/:id', updateProduct);     
router.delete('/:id', deleteProduct);    

export default router;
