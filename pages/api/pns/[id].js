import prisma from 'lib/prisma';

export default async function handler(req, res) {
  const { id: idString } = req.query;
  const id = parseInt(idString, 10);
  switch (req.method) {
    case 'GET':
      const pns = await prisma.r_pegawai_aktual.findUnique({
        where: {
          id,
        },
      });
      return res.status(200).json({ message: 'Data found', data: pns });
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
