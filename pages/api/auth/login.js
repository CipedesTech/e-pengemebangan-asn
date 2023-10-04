import prisma from 'lib/prisma';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      const { username, password } = req.body;
      if (!username || !password) return res.status(500).json({ message: 'Validation Error', data: '' });

      const user = await prisma.m_user.findUnique({
        where: {
          email: username,
        },
        include: {
          Role: {
            select: { name: true },
          },
        },
      });
      if (!user) return res.status(401).json({ message: 'Pengguna tidak ditemukan', data: '' });
      if (!await bcrypt.compare(password, user.password)) return res.status(401).json({ message: 'Password salah', data: '' });
      delete user.password;

      return res.status(200).json({ message: 'Login Berhasil!', data: user });

    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
