import pool from '../db.js';

// 전체 상품 조회
export const getAllProducts = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
};

// 상품 생성
export const createProduct = async (req, res, next) => {
  const { name, price } = req.body;
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
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: rows[0] });
  } catch (err) {
    next(err);
  }
};
