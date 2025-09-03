import pool from '../db.js';
import { HttpError } from '../errors/httpError.js';

// 전체 주문 조회
export const listItems = async (req, res, next) => {
	try {
		const [rows] = await pool.query('SELECT * FROM items ORDER BY id DESC');
		if (rows.length === 0){
			return next(new HttpError(500, 'DB 조회 실패'));
		}
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

// 아이템 생성
export const createItem = async (req, res, next) => {
	const { name, description, price } = req.body;
	if (!name) {
    	return next(new HttpError(400, '아이템 이름은 필수입니다.'));
    }
    if (typeof price !== "number" || price < 0) {
        return next(new HttpError(400, '상품 가격은 0 이상의 숫자여야 합니다.'));
    }
	try {
		const [result] = await pool.execute(
			'INSERT INTO items (name, description, price) VALUES (?, ?, ?)',
			[name, description, price]
		);
		res.status(201).json({
			data: { id: result.insertId, name, description, price },
		});
	} catch (err) {
		next(err);
	}
};

export const getItem = async (req, res, next) => {
	const { id } = req.params;
	try {
		const [rows] = await pool.execute(
			'SELECT * FROM items WHERE id = ?', [id]
		);
		if (rows.length === 0){
			return next(new HttpError(404, "존재하지 않는 아이템입니다."));
		}
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

export const updateItem = async (req, res, next) => {
   const id = Number(req.params.id);
   try {
    const [rows] = await pool.query('SELECT name, description, price FROM items WHERE id = ? ', id); // 교체 원하는게 있는지부터 확인
    if(rows.length === 0)
        {
            return next(new HttpError(404, "수정 대상이 없습니다."));
        }
    const { name, description, price } = req.body;
    await pool.execute( 
      'UPDATE items SET name = ?, description = ?, price = ? WHERE id = ?',
      [name, description, price, id]);
    res.json({ data: id, name, description, price });
  } catch (err) {
    next(err);
  }
};

export const deleteItem = async (req, res, next) => {
    const id = Number(req.params.id);
    try {
    const [rows] = await pool.query('SELECT id, name, description, price FROM items WHERE id = ? ', id);
    if(rows.length === 0)
    {
        return next(new HttpError(404, "삭제하려는 대상을 찾을 수 없습니다."));
    }
    await pool.execute('DELETE FROM items WHERE id = ?', [id]);
    res.status(204).send(); // No Content
    }
    catch (err) {
        next(err);
    }
}