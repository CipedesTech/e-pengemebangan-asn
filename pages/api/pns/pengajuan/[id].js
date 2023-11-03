import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  const { status, diklat, keterangan, subdiklat, subdiklatChild } = req.body;
  switch (req.method) {
    case 'PUT':
      try {
        const pengajuan = await prisma.t_pns_diajukan.update({
          where: {
            id,
          },
          data: {
            status,
            diklat,
            subdiklat,
            subdiklatChild,
            keterangan: {
              create: {
                keterangan,
                status,
              },
            },
          },
        });
        return res.status(200).json({ message: 'Data Status updated', data: pengajuan });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
