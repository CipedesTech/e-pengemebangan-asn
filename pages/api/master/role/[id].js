import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case 'PUT':
      try {
        const role = await prisma.m_role.update({
          where: {
            id,
          },
          data: req.body,
        });
        return res.status(200).json({ message: 'Data updated', data: role });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    case 'GET':
      try {
        const role = await prisma.m_role.findUnique({
          where: {
            id,
          },
        });
        if (!role) return res.status(404).json({ message: 'Data not found', data: role });
        return res.status(200).json({ message: 'Data found', data: role });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    case 'DELETE':
      try {
        const role = await prisma.m_role.delete({
          where: {
            id,
          },
        });
        return res.status(200).json({ message: 'Data deleted', data: role });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
