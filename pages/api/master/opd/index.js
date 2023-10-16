/* eslint-disable camelcase */
import prisma from 'lib/prisma';
import QueryString from 'qs';

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { nama, kode_opd } = req.body;
        if (!nama || !kode_opd) return res.status(403).json({ message: 'Validation error', data: '' });
        const role = await prisma.m_opd.create({
          data: {
            nama,
            kode_opd,
          },
        });
        return res.status(201).json({ message: 'OPD berhasil ditambahkan', data: role });
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Terjadi Kesalahan Pada Server', data: err });
      }
    case 'GET':
      const { where, orderBy, page: pages, perPage: perPages } = QueryString.parse(req.query);
      console.log(where);
      const page = Number(pages || pages) || 1;
      const perPage = Number(perPages || perPages) || 10;
      const skip = page > 0 ? perPage * (page - 1) : 0;
      const [total, data] = await Promise.all([
        prisma.m_opd.count({ where }),
        prisma.m_opd.findMany({
          where,
          orderBy,
          take: perPage,
          skip,
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
