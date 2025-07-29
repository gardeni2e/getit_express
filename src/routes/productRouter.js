import { Router } from "express";
import { getProduct, createProduct } from "../controllers/productController.js";

const productRouter = Router(); 

productRouter.get('/', getProduct);
productRouter.post('/', createProduct);

export default productRouter;