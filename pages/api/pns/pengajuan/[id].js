import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const { status, diklat } = req.body;
  switch (req.method) {
    case 'PUT':
      try {
        const pengajuan = await prisma.m_pns_diajukan.update({
          where: {
            id,
          },
          data: {
            status,
            diklat,
          },
        });
        return res.status(200).json({ message: 'Data Status updated', data: pengajuan });
      } catch (err) {
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
