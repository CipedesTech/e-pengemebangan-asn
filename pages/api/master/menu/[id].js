import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case 'PUT':
      try {
        const menu = await prisma.m_menu_access.update({
          where: {
            id,
          },
          data: req.body,
        });
        return res.status(200).json({ message: 'Data updated', data: menu });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    case 'GET':
      try {
        const menu = await prisma.m_menu_access.findUnique({
          where: {
            id,
          },
        });
        if (!menu) return res.status(404).json({ message: 'Data not found', data: menu });
        return res.status(200).json({ message: 'Data found', data: menu });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    case 'DELETE':
      try {
        const menu = await prisma.m_menu_access.delete({
          where: {
            id,
          },
        });
        return res.status(200).json({ message: 'Data deleted', data: menu });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
