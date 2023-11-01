/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
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

const diklat = [
  {
    nama: 'MANAJERIAL',
    sub: [
      {
        nama: 'Pelatihan Dasar',
        children: [
          {
            label: 'Diklat Prajabatan',
            value: 'Diklat Prajabatan',
          },
          {
            label: 'Pelatihan Dasar CPNS',
            value: 'Pelatihan Dasar CPNS',
          },
        ],
      },
      {
        nama: 'Pelatihan Kepemimpinan',
        children: [
          {
            label: 'Diklat Kepemimpinan Tk. IV',
            value: 'Diklat Kepemimpinan Tk. IV',
          },
          {
            label: 'Diklat Kepemimpinan Tk. III',
            value: 'Diklat Kepemimpinan Tk. III',
          },
          {
            label: 'Diklat Kepemimpinan Tk. III',
            value: 'Diklat Kepemimpinan Tk. III',
          },
          {
            label: 'Diklat Kepemimpinan Tk. I',
            value: 'Diklat Kepemimpinan Tk. I',
          },
          {
            label: 'Pelatihan Kepemimpinan Pengawas (PKP)',
            value: 'Pelatihan Kepemimpinan Pengawas (PKP)',
          },
          {
            label: 'Pelatihan Kepemimpinan Administrator (PKA)',
            value: 'Pelatihan Kepemimpinan Administrator (PKA)',
          },
          {
            label: 'Pelatihan Kepemimpinan Nasional (PKN) Tk. II',
            value: 'Pelatihan Kepemimpinan Nasional (PKN) Tk. II',
          },
          {
            label: 'Pelatihan Kepemimpinan Nasional (PKN) Tk. I',
            value: 'Pelatihan Kepemimpinan Nasional (PKN) Tk. I',
          },
        ],
      },
    ],
  },
  {
    nama: 'SOSIAL KULTURAL',
    sub: [
      {
        nama: 'Pelatihan Soskul Jenjang I',
      },
      {
        nama: 'Pelatihan Soskul Jenjang II',
      },
      {
        nama: 'Pelatihan Soskul Jenjang III',
      },
    ],
  },
  {
    nama: 'TEKNIS',
    sub: [
      {
        nama: 'Pembangunan Manusia & Kebudayaan',
        children: [
          {
            label: 'Agama',
            value: 'Agama',
          },
          {
            label: 'Kesehatan',
            value: 'Kesehatan',
          },
          {
            label: 'Sosial, Kependudukan, Pembangunan Desa & Pemberdayaan Perempuan',
            value: 'Sosial, Kependudukan, Pembangunan Desa & Pemberdayaan Perempuan',
          },
          {
            label: 'Pendidikan',
            value: 'Pendidikan',
          },
          {
            label: 'Seni & Budaya',
            value: 'Seni & Budaya',
          },
          {
            label: 'Sains',
            value: 'Sains',
          },
          {
            label: 'Keolahragaan',
            value: 'Keolahragaan',
          },
        ],
      },
      {
        nama: 'Koordinatif / Pendukung',
        children: [
          {
            label: 'Kearsipan',
            value: 'Kearsipan',
          },
          {
            label: 'Kehumasan',
            value: 'Kehumasan',
          },
          {
            label: 'Kepegawaian',
            value: 'Kepegawaian',
          },
          {
            label: 'Perencanaan',
            value: 'Perencanaan',
          },
          {
            label: 'Keuangan',
            value: 'Keuangan',
          },
          {
            label: 'Barang Jasa/Pemerintah',
            value: 'Barang Jasa/Pemerintah',
          },
          {
            label: 'Pengawasan Internal',
            value: 'Pengawasan Internal',
          },
        ],
      },
      {
        nama: 'Kemaritiman & Investasi',
        children: [
          {
            label: 'Kelautan & Perikanan',
            value: 'Kelautan & Perikanan',
          },
          {
            label: 'Pariwisata & Ekra',
            value: 'Pariwisata & Ekra',
          },
          {
            label: 'Perhubungan',
            value: 'Perhubungan',
          },
          {
            label: 'E S D M',
            value: 'E S D M',
          },
        ],
      },
      {
        nama: 'Perekonomian',
        children: [
          {
            label: 'Perindustrian',
            value: 'Perindustrian',
          },
          {
            label: 'Perdagangan',
            value: 'Perdagangan',
          },
          {
            label: 'Pertanian',
            value: 'Pertanian',
          },
          {
            label: 'LHK',
            value: 'LHK',
          },
          {
            label: 'ATR / Pertanahan',
            value: 'ATR / Pertanahan',
          },
          {
            label: 'Ketenagakerjaan',
            value: 'Ketenagakerjaan',
          },
          {
            label: 'PUPR',
            value: 'PUPR',
          },
        ],
      },
      {
        nama: 'Politik Hukum & Keamanan',
        children: [
          {
            label: 'Pemerintahan Dalam Negeri',
            value: 'Pemerintahan Dalam Negeri',
          },
          {
            label: 'Hubungan Luar Negeri',
            value: 'Hubungan Luar Negeri',
          },
          {
            label: 'Pertahanan & Keamanan',
            value: 'Pertahanan & Keamanan',
          },
          {
            label: 'Komunikasi & Informatika',
            value: 'Komunikasi & Informatika',
          },
          {
            label: 'Pemberantasan Narkotika',
            value: 'Pemberantasan Narkotika',
          },
          {
            label: 'Keamanan Siber & Persandian',
            value: 'Keamanan Siber & Persandian',
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const element of diklat) {
    console.log(element);
    await prisma.m_diklat.create({
      data: {
        nama: element.nama,
        diklat: {
          create: element.sub,
        },
      },
    });
  }
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
