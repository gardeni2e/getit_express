import pool from '../db.js';
import { HttpError } from '../errors/httpError.js';

// 전체 상품 조회
export const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    if (rows.length === 0){
			return next(new HttpError(500, 'DB 조회 실패'));
		}
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

// 상품 생성
export const createProduct = async (req, res, next) => {
  const { name, price } = req.body;
  if (!name || !price) {
    return next(new HttpError(400, '상품 이름과 상품 가격은 필수입니다.'));
  }
  if (typeof price !== "number" || !Number.isFinite(price)) {
    return next(new HttpError(400, '상품 가격은 숫자여야 합니다.'));
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO products (name, price) VALUES (?, ?)',
      [name, price]
    );
    res.status(201).json({ data: { id: result.insertId, name, price } });
  } catch (err) {
    next(err);
  }
};

// 단일 상품 조회
export const getProductById = async (req, res, next) => {
  const { id } = req.params;
  const parsedId = Number(id);
  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    return next(new HttpError(400, "유효하지 않은 상품 ID입니다."));
  }
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    if (rows.length === 0){
      return next(new HttpError(404, "상품이 존재하지 않습니다."));
    } 
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};
