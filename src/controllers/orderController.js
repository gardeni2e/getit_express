import pool from '../db.js';

// 전체 주문 조회
export const getAllOrders = async (req, res, next) => {
	try {
		const [rows] = await pool.query('SELECT * FROM orders');
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

// 주문 생성
export const createOrder = async (req, res, next) => {
	const { user_id, product_id } = req.body;
	try {
		const [result] = await pool.execute(
			'INSERT INTO orders (user_id, product_id) VALUES (?, ?)',
			[user_id, product_id]
		);
		res.status(201).json({
			data: { id: result.insertId, user_id, product_id },
		});
	} catch (err) {
		next(err);
	}
};

// 사용자+상품 JOIN 조회
export const getJoinedOrders = async (req, res, next) => {
	try {
		const sql = `
      SELECT o.id AS order_id,
             u.name AS user_name,
             p.name AS product_name,
             o.order_date
      FROM orders o
      JOIN users u       ON o.user_id    = u.id
      JOIN products p    ON o.product_id = p.id
    `;
		const [rows] = await pool.query(sql);
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};

// 특정 사용자 주문 조회
// 과제 제출 시 수정하시면 됩니다 !
export const getUserOrders = async (req, res, next) => {
	const { userId } = req.params;
	try {
		const [rows] = await pool.execute(
			'SELECT o.id, o.user_id, u.name AS user_name, p.name AS product_name, o.order_date FROM orders o JOIN users u ON o.user_id = u.id JOIN products p ON o.product_id = p.id WHERE user_id = ?',
			[userId]
		); // WHERE은 단순히 조회 범위를 줄이는 필터, ON은 두 테이블을 어떤 칼럼으로 연결할지 결정.. JOIN한다고 새로운 테이블이 생기는건 X, ON 빼면은 데카르트 곱 발생, AS 빼면 name으로 겹쳐서 product_name이랑 user_name 부분이 합쳐져버림
		res.json({ data: rows });
	} catch (err) {
		next(err);
	}
};
