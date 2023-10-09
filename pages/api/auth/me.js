import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.SECRET_KEY);
          return res.status(200).json({ message: 'otentikasi pengguna berhasil', data: decoded });
        } catch (err) {
          return res.status(401).json({ message: 'Pengguna tidak ter otentikasi', data: '' });
        }
      }
      return res.status(401).json({ message: 'Pengguna tidak ter otentikasi', data: '' });
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
