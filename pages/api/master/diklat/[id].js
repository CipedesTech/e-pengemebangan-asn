import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case 'PUT':
      try {
        const diklat = await prisma.m_diklat.update({
          where: {
            id,
          },
          data: req.body,
        });
        return res.status(200).json({ message: 'Data updated', data: diklat });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    case 'GET':
      try {
        const diklat = await prisma.m_diklat.findUnique({
          where: {
            id,
          },
        });
        if (!diklat) return res.status(404).json({ message: 'Data not found', data: diklat });
        return res.status(200).json({ message: 'Data found', data: diklat });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    case 'DELETE':
      try {
        const diklat = await prisma.m_diklat.delete({
          where: {
            id,
          },
        });
        return res.status(200).json({ message: 'Data deleted', data: diklat });
      } catch (err) {
        return res.status(500).json({ message: 'terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
