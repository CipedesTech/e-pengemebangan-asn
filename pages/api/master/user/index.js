import prisma from 'lib/prisma';
import QueryString from 'qs';
import bcrypt from 'bcrypt';

const saltRounds = 10;

export default async function handler(req, res) {
  switch (req.method) {
    case 'POST':
      try {
        const { name, email, password, roleId, opdId } = req.body;
        if (!name || !email || !password || !roleId || !opdId) return res.status(403).json({ message: 'Validation error', data: '' });
        const salt = await bcrypt.genSalt(saltRounds);
        const user = await prisma.m_user.create({
          data: {
            name,
            email,
            password: await bcrypt.hash(password, salt),
            roleId,
            opdId,
          },
        });
        delete user.password;
        return res.status(201).json({ message: 'Role berhasil ditambahkan', data: user });
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
        prisma.m_user.count({ where }),
        prisma.m_user.findMany({
          where,
          orderBy,
          take: perPage,
          skip,
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            Opd: {
              select: {
                id: true,
                nomenklatur_pada: true,
              },
            },
            Role: {
              select: {
                id: true,
                name: true,
              },
            },
          },
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
