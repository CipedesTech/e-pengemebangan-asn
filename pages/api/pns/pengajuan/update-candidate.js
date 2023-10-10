import prisma from 'lib/prisma';

export default async function handler(req, res) {
  switch (req.method) {
    case 'PUT':
      try {
        const { datas, id } = req.body;
        if (datas.length < 1) return res.status(403).json({ message: 'empty data', data: '' });
        // eslint-disable-next-line no-restricted-syntax
        for (const el of datas) {
          // eslint-disable-next-line no-await-in-loop
          await prisma.m_pns_diajukan.update({
            where: {
              id: el.id,
            },
            data: {
              m_pelaksanaan_diklatId: id,
            },
          });
        }
        return res.status(200).json({ message: 'Update berhasil dilakukan', data: [] });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Terjadi Kesalahan Pada Server', data: err });
      }
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
