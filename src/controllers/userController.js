// 임시 데이터 (In-Memory)
let users = [];
let nextId = 1;

// 전체 조회
import pool from '../db.js';

// async await
// async 선언해주면 Promis 객체 반환 -> Wrapper 객체 느낌
// {status : ok/fail, data: {any}} -> status가 ok/fail인지 확인가능 await해서 fail이면 계속 실행하는거임 먼말알?
// await 코드가 쿼리 실행되는걸 기다려야함 -> 쿼리 실행 안됐는데 코드 쭉 실행되면 빈 값을 제공해줄거임 그래서 awiat으로 기다리게
export const getAllUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users'); // return 값이 [row, fields]여서 [row]만 가져올거라 이렇게 지정
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
};

// 단일조회
export const getUserById = async (req, res, next) => {
  try {
    const id = Number(req.params.id); // /:id 있는 것들은 모두 이 코드 필요한 듯(어떤 것 조회/수정/삭제할지 파악)
    const [rows] = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = ? ', id);
    if(rows.length === 0) // !rows가 빈 배열로 반환되어도 True로 판단하니깐 이렇게 수정해야 함
    {
        return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ data: rows });
  } catch (err) {
    next(err);
  }
};

// 생성
export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) { // 올바른 요청인지 검사
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const [rows] = await pool.query('SELECT email, created_at FROM users WHERE email = ? ', email); // 이메일 중복 검사
  if(rows.length !== 0)
  {
    return res.status(409).json({ error: 'Email Duplication' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    const insertedId = result.insertId;
    res.status(201).json({ data: { id: insertedId, name, email } });
  } catch (err) { // GPT 피셜 이메일 중복시 if (err.code === 'ER_DUP_ENTRY')로 처리 가능하다는...
    next(err);
  }
};

// 전체 교체 (PUT)
export const replaceUser = async (req, res, next) => {
  const id = Number(req.params.id);
   try {
    const [rows] = await pool.query('SELECT id, name FROM users WHERE id = ? ', id); // 교체 원하는게 있는지부터 확인
    if(rows.length === 0)
        {
            return res.status(404).json({ error: 'User not found' });
        }
    const { name, email } = req.body;
    if (!name || !email)
    {
    return res.status(400).json({ error: 'Name and email are required' });
    }
   await pool.execute( // result(변경된 값이 뭔지 들어있지 않음, 그냥 변경 관련 정보 표시해줌) 사용 안하니 const [result] 필요 없음
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name, email, id]);
    res.json({ data: id, name, email }); // PUT 수행하고 정보 표시할 때 created_at까지 모두 표시하고 싶으면 .query로 조회해야함
  } catch (err) {
    next(err);
  }
};

/*
// 일부 수정 (PATCH)
export const updateUser = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;
  res.json({ data: user });
};
*/

export const deleteUser = async (req, res, next) => {
    const id = Number(req.params.id);
    try {
    const [rows] = await pool.query('SELECT id, name FROM users WHERE id = ? ', id);
    if(rows.length === 0)
    {
        return res.status(404).json({ error: 'User not found' });
    }
    await pool.execute('DELETE FROM users WHERE id = ?', [id]); // .excute는 파라미터 배열로 줘야 함
    res.status(204).send(); // No Content
    }
    catch (err) {
        next(err);
    }
}