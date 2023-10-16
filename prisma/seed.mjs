import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  await prisma.m_role.createMany({
    data: [
      { name: 'ADMIN' },
      { name: 'UMPEG' },
      { name: 'DIKLAT' },
      { name: 'Kepala BPKPSDM' },
    ],
    skipDuplicates: true,
  });

  await prisma.m_opd.createMany({
    data: [
      { kode_opd: 'MST-01', nama: 'Master OPD 1' },
      { kode_opd: 'TST-01', nama: 'Testing OPD 1' },
      { kode_opd: 'TST-02', nama: 'Testing OPD 2' },
    ],
    skipDuplicates: true,
  });

  const opd = await prisma.m_opd.findMany();
  const opds = {
    master1: opd.filter((el) => el.kode_opd === 'MST-01')[0].id,
    testing1: opd.filter((el) => el.kode_opd === 'TST-01')[0].id,
    testing2: opd.filter((el) => el.kode_opd === 'TST-02')[0].id,
  };

  const role = await prisma.m_role.findMany();
  const roles = {
    admin: role.filter((el) => el.name === 'ADMIN')[0].id,
    umpeg: role.filter((el) => el.name === 'UMPEG')[0].id,
    diklat: role.filter((el) => el.name === 'DIKLAT')[0].id,
    kepala: role.filter((el) => el.name === 'Kepala BPKPSDM')[0].id,
  };

  const salt = await bcrypt.genSalt(saltRounds);

  await prisma.m_user.createMany({
    data: [
      {
        name: 'Admin',
        email: 'admin@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.admin,
        opdId: opds.master1,
      },
      {
        name: 'Umpeg OPD 1',
        email: 'umpeg1@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.umpeg,
        opdId: opds.testing1,
      },
      {
        name: 'Umpeg OPD 2',
        email: 'umpeg2@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.umpeg,
        opdId: opds.testing2,
      },
      {
        name: 'Diklat',
        email: 'diklat@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.diklat,
        opdId: opds.master1,
      },
      {
        name: 'Kepala',
        email: 'kepala.bpkpsdm@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.kepala,
        opdId: opds.master1,
      },
    ],
    skipDuplicates: true,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
