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
  });

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
      { name: 'Admin', email: 'admin@mail.id', password: await bcrypt.hash('asdqwe123', salt), roleId: roles.admin },
      { name: 'Umpeg', email: 'umpeg@mail.id', password: await bcrypt.hash('asdqwe123', salt), roleId: roles.umpeg },
      { name: 'Diklat', email: 'diklat@mail.id', password: await bcrypt.hash('asdqwe123', salt), roleId: roles.diklat },
      { name: 'Kepala', email: 'kepala.bpkpsdm@mail.id', password: await bcrypt.hash('asdqwe123', salt), roleId: roles.kepala },
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
