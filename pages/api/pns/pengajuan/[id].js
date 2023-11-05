import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case 'PUT':
      const { status, diklat, keterangan, subdiklat, subdiklatChild } = req.body;
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
    case 'GET':
      try {
        const pengajuan = await prisma.t_pns_diajukan.findUnique({
          where: {
            id,
          },
          include: {
            pegawai_id: true,
            kompetensi: true,
            subKompetensi: true,
          },
        });
        if (!pengajuan) return res.status(404).json({ message: 'Data not found', data: pengajuan });
        return res.status(200).json({ message: 'Data ditemukan', data: pengajuan });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Terjadi kesalahan pada server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
