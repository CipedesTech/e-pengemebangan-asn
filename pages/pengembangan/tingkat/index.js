import AppLayout from 'layouts/app-layout';
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';

import {
  Divider, Empty,
  Form,
  Input,
  Button,
  Radio,
  Select,
  Cascader,
  DatePicker,
  InputNumber,
  TreeSelect,
  Switch,
  Checkbox,
  Upload,
  Space,
} from 'antd';

const { RangePicker } = DatePicker;
const { TextArea } = Input;
function TingkatPengembangan() {
  const onFormLayoutChange = (value) => {
    console.log(value);
  };
  return (
    <>
      <Divider />
      <Form
        layout='horizontal'
        onValuesChange={onFormLayoutChange}
      >
        <Form.Item label='1. Nama'>
          <Input />
        </Form.Item>
        <Form.Item label='2. NIP'>
          <Input />
        </Form.Item>
        <Form.Item label='3. Pangkat/Golongan'>
          <Input />
        </Form.Item>
        <Form.Item name='labels' label='4. Pendidikan Terakhir'>
          <Radio.Group>
            <Radio value='SMP'> SMP </Radio>
            <Radio value='SMA'> SMA </Radio>
            <Radio value='D-III'> D-III </Radio>
            <Radio value='D-IV/S-1'> D-IV/S-1 </Radio>
            <Radio value='S-2'> S-2</Radio>
            <Radio value='S-3'> S-3</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item label='5. Unit Kerja'>
          <Input />
        </Form.Item>
        <Form.Item name='labels' label='6. Jabatan'>
          <Radio.Group>
            <Space direction='vertical'>
              <Radio value='JPT'>1. JPT </Radio>
              <Radio value='Administrator'>2. Administrator </Radio>
              <Radio value='Pengawas'>3. Pengawas </Radio>
              <Radio value='Fungsional'>4. Fungsional </Radio>
              <Radio value='Pelaksanaan'>5. Pelaksana</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <Form.Item name='labels' label='7. Kebutuhan Pengembangan Kompetensi '>
          <Radio.Group>
            <Space direction='vertical'>
              <Radio value='Manajerial'>1. Manajerial </Radio>
              <Radio value='Fungsional'>2. Fungsional </Radio>
              <Radio value='Teknis'>3. Teknis </Radio>
              <Radio value='Sosiokultural'>4. Sosiokultural </Radio>
              <Radio value='Pemerintahan'>5. Pemerintahan</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
        <p style={{ color: '#1a3353', fontWeight: '600' }}>8. Bentuk pengembangan kompetensi yang akan diikuti</p>
        <Form.Item name='labels'>
          <Radio.Group>
            <Radio value='Klasikal'>Klasikal</Radio>
            <Radio value='Non Klasikal'>Non Klasikal</Radio>
          </Radio.Group>
        </Form.Item>
        <p style={{ color: '#1a3353', fontWeight: '600' }}>9. Bentuk Pengembangan Kompetensi Klasikal yang akan diikuti</p>
        <Form.Item name='labels'>
          <Radio.Group>
            <Radio value='Tugas Belajar'>Tugas Belajar</Radio>
            <Radio value='Pelatihan'>Pelatihan</Radio>
            <Radio value='Workshop'>Workshop</Radio>
            <Radio value='Seminar'>Seminar</Radio>
            <Radio value='Bimtek'>Bimtek</Radio>
            <Radio value='Kursus'>Kursus</Radio>
            <Radio value='Penataran'>Penataran</Radio>
            <Radio value='Konfrensi'>Konfrensi</Radio>
            <Radio value='Sosialisasi'>Sosialisasi</Radio>
            <Radio value='Lainnya'>Lainnya</Radio>
          </Radio.Group>
        </Form.Item>
        <p style={{ color: '#1a3353', fontWeight: '600' }}>10. Bentuk Pengembangan Kompetensi Non Klasikal yang akan diikuti</p>
        <Form.Item name='labels'>
          <Radio.Group>
            <Radio value='Coaching'>Coaching</Radio>
            <Radio value='Mentoring'>Mentoring</Radio>
            <Radio value='E-Learning'>E-Learning</Radio>
            <Radio value='Pelatihan Jarak Jauh'>Pelatihan Jarak Jauh</Radio>
            <Radio value='Datasering'>Datasering</Radio>
            <Radio value='Pembelajaran Alama Terbuka'>Pembelajaran Alama Terbuka</Radio>
            <Radio value='Patokan Banding'>Patokan Banding</Radio>
            <Radio value='Pertukaran Pegawai'>Pertukaran Pegawai</Radio>
            <Radio value='Belajar Mandiri'>Belajar Mandiri</Radio>
            <Radio value='Komunikasi Belajar'>Komunikasi Belajar</Radio>
            <Radio value='Bimbingan di tempat Kerja'>Bimbingan di tempat Kerja</Radio>
            <Radio value='Magang'>Magang</Radio>
            <Radio value='Lainnya'>Lainnya</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
      <Empty />
    </>
  );
}

TingkatPengembangan.getLayout = function getLayout(page) {
  return (
    <AppLayout title='Tingkat' onTab='tingkat'>
      {page}
    </AppLayout>
  );
};

export default TingkatPengembangan;
