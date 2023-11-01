import prisma from 'lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { username, password } = req.body;
      if (!username || !password) { return res.status(500).json({ message: 'Validation Error', data: '' }); }

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
          Opd: {
            select: {
              nomenklatur_pada: true,
              id: true,
            },
          },
        },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: 'Pengguna tidak ditemukan', data: '' });
      }
      if (!(await bcrypt.compare(password, user.password))) { return res.status(401).json({ message: 'Password salah', data: '' }); }
      delete user.password;

      const { id, name, email, Role, Opd } = user;
      const payload = {
        id,
        name,
        email,
        role: Role.name,
        opd: { id: Opd.id, nama: Opd.nomenklatur_pada },
      };

      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: '4h',
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
        expiresIn: '5d',
      });

      return res
        .status(200)
        .json({ message: 'Login Berhasil!', data: { token, refreshToken } });

    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
