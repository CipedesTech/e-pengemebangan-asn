import prisma from 'lib/prisma';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function handler(req, res) {
  switch (req.method) {
    case 'PUT':
      try {
        const { id, currentPassword, newPassword } = req.body;
        if (!id || !currentPassword || !newPassword) { return res.status(500).json({ message: 'Validation Error', data: '' }); }
        const salt = await bcrypt.genSalt(saltRounds);
        const user = await prisma.m_user.findUnique({
          where: {
            id,
          },
        });
        if (!(await bcrypt.compare(currentPassword, user.password))) { return res.status(404).json({ message: 'Password saat ini salah', data: '' }); }
        await prisma.m_user.update({
          where: {
            id,
          },
          data: {
            password: await bcrypt.hash(newPassword, salt),
          },
        });
        return res.status(200).json({ message: 'Password telah berhasil di perbarui', data: user });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
