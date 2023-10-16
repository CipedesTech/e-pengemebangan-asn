import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case 'PUT':
      try {
        const opd = await prisma.m_opd.update({
          where: {
            id,
          },
          data: req.body,
        });
        return res.status(200).json({ message: 'Data updated', data: opd });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    case 'GET':
      try {
        const opd = await prisma.m_opd.findUnique({
          where: {
            id,
          },
        });
        if (!opd) return res.status(404).json({ message: 'Data not found', data: opd });
        return res.status(200).json({ message: 'Data found', data: opd });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    case 'DELETE':
      try {
        const opd = await prisma.m_opd.delete({
          where: {
            id,
          },
        });
        return res.status(200).json({ message: 'Data deleted', data: opd });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
