import prisma from 'lib/prisma';
import QueryString from 'qs';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { pagu, nama, diklat, kuota } = req.body;
        if (!pagu || !nama || !diklat || !kuota) return res.status(403).json({ message: 'Validation error', data: '' });
        const agendaDiklat = await prisma.t_pelaksanaan_diklat.create({
          data: {
            nama,
            diklat,
            pagu: parseInt(pagu, 10),
            kuota: parseInt(kuota, 10),
          },
        });
        return res.status(201).json({ message: 'Agenda diklat berhasil ditambahkan', data: agendaDiklat });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Terjadi Kesalahan Pada Server', data: err });
      }
    case 'GET':
      const { where, orderBy, page: pages, perPage: perPages } = QueryString.parse(req.query);
      const page = Number(pages || pages) || 1;
      const perPage = Number(perPages || perPages) || 10;
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const [total, data] = await Promise.all([
        prisma.t_pelaksanaan_diklat.count({ where }),
        prisma.t_pelaksanaan_diklat.findMany({
          where,
          take: perPage,
          skip,
          include: {
            t_pns_diajukan: true,
            Diklat: true,
          },
          orderBy,
        }),
      ]);
      const lastPage = Math.ceil(total / perPage);
      const result = {
        data,
        meta: {
          total,
          lastPage,
          currentPage: page,
          perPage,
          prev: page > 1 ? page - 1 : null,
          next: page < lastPage ? page + 1 : null,
        },
      };
      return res.status(200).json({ message: 'Data Berhasil ditemukan', data: result });
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
