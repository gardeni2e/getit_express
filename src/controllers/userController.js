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



// 단일 조회
export const getUserById = (req, res) => {
  const id = Number(req.params.id);
  const user = users.find(u => u.id === id);
  if (!user) {
  return res.status(404).json({ error: 'User not found' });
  }
  // else
  res.json({ data: user });
};

// 생성
export const createUser = async (req, res, next) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  try {
    const [result] = await pool.execute(
      'INSERT INTO users (name, email) VALUES (?, ?)',
      [name, email]
    );
    const insertedId = result.insertId;
    res.status(201).json({ data: { id: insertedId, name, email } });
  } catch (err) {
    next(err);
  }
};



// 전체 교체 (PUT)
export const replaceUser = (req, res) => {
  const id = Number(req.params.id);
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  users[index] = { id, name, email };
  res.json({ data: users[index] });
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

// 삭제
export const deleteUser = (req, res) => {
  const id = Number(req.params.id);
  // id가 같은 값이 없다면 404 Not found를 줘야 하지 않을까?
  users = users.filter(u => u.id !== id);
  res.status(204).send(); // No Content
};
