import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const saltRounds = 10;

const menuAccess = [
  {
    id: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    url: '/',
    name: 'Menu',
    icon: null,
    parentId: null,
    allowedRole: null,
    order: 0,
  },
  {
    id: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    url: '/master-data/1',
    name: 'Master Data',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN"]',
    order: 4,
  },
  {
    id: '0ccbadc1-1fc6-480f-ad4f-080edd2b0e1d',
    url: '/verifikasi-pengajuan',
    name: 'Verifikasi PNS',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN","DIKLAT","Kepala BPKPSDM"]',
    order: 2,
  },
  {
    id: '3e29e321-baff-4ca6-82eb-5974de771623',
    url: '/master-data/menu',
    name: 'Konfigurasi Menu',
    icon: null,
    parentId: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    allowedRole: null,
    order: 4,
  },
  {
    id: '7b37ee09-ea73-4066-908c-886c9696d915',
    url: '/master-data/diklat',
    name: 'Diklat',
    icon: null,
    parentId: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    allowedRole: null,
    order: 3,
  },
  {
    id: 'a27ce383-5170-4acb-ae16-84c8af428dee',
    url: '/master-data/pengguna',
    name: 'Pengguna',
    icon: null,
    parentId: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    allowedRole: null,
    order: 0,
  },
  {
    id: 'de3328c6-06be-432f-a8c8-4a815f0d9c8c',
    url: '/list-pns',
    name: 'List PNS',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN","UMPEG","DIKLAT","Kepala BPKPSDM"]',
    order: 0,
  },
  {
    id: 'e0ae68c9-ae58-4825-971e-0103f08b9722',
    url: '/master-data/opd',
    name: 'Opd',
    icon: null,
    parentId: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    allowedRole: null,
    order: 1,
  },
  {
    id: 'e871cac3-25a0-4b97-b419-1f0269f2886a',
    url: '/pelaksanaan-diklat',
    name: 'Pelaksanaan Diklat',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN","DIKLAT","Kepala BPKPSDM"]',
    order: 3,
  },
  {
    id: 'e9f45b17-990c-452c-a6d3-99ea77eee380',
    url: '/master-data/peran',
    name: 'Role',
    icon: null,
    parentId: '09fc3ba9-447a-4ee1-8cb6-e0f03aadccab',
    allowedRole: null,
    order: 2,
  },
  {
    id: 'fe1fbc16-701a-431e-8439-0d9372295ece',
    url: '/rencana-pengembangan',
    name: 'Rencana Pengembangan',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN","UMPEG","DIKLAT","Kepala BPKPSDM"]',
    order: 1,
  },
  {
    id: '09b9fc4b-346d-4155-aced-e0b5729126cc',
    url: '/monev',
    name: 'Monev',
    icon: 'UnorderedListOutlined',
    parentId: '0251a4d2-b07f-415b-ab5e-2d091a60debb',
    allowedRole: '["ADMIN","Kepala BPKPSDM"]',
    order: 5,
  },
];

async function main() {
  await prisma.m_menu_access.createMany({
    data: menuAccess,
  });

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

  const nomenklaturPrada = await prisma.r_nomenklatur_pada.create({
    data: {
      nomenklatur_pada: 'master',
    },
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
      {
        name: 'Admin',
        email: 'admin@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.admin,
        opdId: nomenklaturPrada.id,
      },
      {
        name: 'Umpeg OPD 1',
        email: 'umpeg1@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.umpeg,
        opdId: nomenklaturPrada.id,
      },
      {
        name: 'Umpeg OPD 2',
        email: 'umpeg2@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.umpeg,
        opdId: nomenklaturPrada.id,
      },
      {
        name: 'Diklat',
        email: 'diklat@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.diklat,
        opdId: nomenklaturPrada.id,
      },
      {
        name: 'Kepala',
        email: 'kepala.bpkpsdm@cianjurkab.go.id',
        password: await bcrypt.hash('asdqwe123', salt),
        roleId: roles.kepala,
        opdId: nomenklaturPrada.id,
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
