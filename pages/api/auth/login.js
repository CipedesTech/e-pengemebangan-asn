import prisma from 'lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { publicRuntimeConfig: Config } = getConfig();

export default async function handler(req, res) {
  const { username, password } = req.body;
  switch (req.method) {
    case 'POST':
      if (!username || !password) return res.status(500).json({ message: 'Validation Error', data: '' });

      const user = await prisma.m_user.findUnique({
        where: {
          email: username,
        },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          Role: {
            select: { name: true },
          },
        },
      });
      if (!user) return res.status(401).json({ message: 'Pengguna tidak ditemukan', data: '' });
      if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Password salah', data: '' });
      delete user.password;

      const { id, name, email, Role } = user;
      const payload = { id, name, email, role: Role.name };

      const token = jwt.sign(payload, Config.SECRET_KEY, { expiresIn: '4h' });
      const refreshToken = jwt.sign(payload, Config.REFRESH_SECRET_KEY, { expiresIn: '5d' });

      return res.status(200).json({ message: 'Login Berhasil!', data: { token, refreshToken } });

    default:
      console.log(jwt.decode(username));
      console.log(jwt.decode(password));
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
