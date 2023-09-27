/* eslint-disable */

import dayjs from 'dayjs';
import jwtDecode from 'jwt-decode';
import RegexPattern from './RegexPattern';

export function formatRupiah(angka, prefix) {
  let separator;
  let number_string = angka.toString().replace(/[^,\d]/g, '').toString(),
    split = number_string.split(','),
    sisa = split[0].length % 3,
    rupiah = split[0].substr(0, sisa),
    ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : '';
    rupiah += separator + ribuan.join('.');
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
  return prefix == undefined ? rupiah : (rupiah ? 'Rp. ' + rupiah : '');
}

export function parseJwt(token) {
  const decode = jwtDecode(token);
  return decode;
}

export const getBreakpoint = (screens) => {
  const breakpoints = [];

  for (const key in screens) {
    if (screens.hasOwnProperty(key)) {
      const element = screens[key];
      if (element) {
        breakpoints.push(key);
      }
    }
  }

  return breakpoints;
};

export const getRouteInfo = (navTree, path) => {
  if (navTree?.url === path) {
    return navTree;
  }

  let route;

  for (let p in navTree) {
    if (navTree.hasOwnProperty(p) && typeof navTree[p] === 'object') {
      route = getRouteInfo(navTree[p], path);

      if (route) {
        return route;
      }
    }
  }

  return route;
};

export const randomAvatarColor = () => {
  const color = ['#FF974D', '#4D9FFF', '#5B4DFF', '#FFAB00', '#FFAB00', '#008F7A', '#064663', '#734046', '#321F28'];

  return color[Math.floor(Math.random() * color.length)];
};

export const initialName = (name) => {
  const names = name.split(' ');
  let initials = names[0].substring(0, 1).toUpperCase();

  if (names.length > 1) {
    initials += names[names.length - 1].substring(0, 1).toUpperCase();
  }

  return initials;
};

export const breadcrumbTitle = (value) => {
  if (value && value !== '') {
    const replaceQuery = value.split(/[?#]/)[0];
    const replaceDash = replaceQuery.replace(/-/g, ' ');
    const newString = replaceDash.split(' ')
      .map(w => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');

    return newString;
  }

  return '';
};

export const checkIfValidUUID = (str) => {
  const regexExp = RegexPattern.uuid;

  return regexExp.test(str);
};

export const ConvertMime = (mimeList) => {
  const type = {
    'application/vnd.ms-excel': 'file/xls',
    'application/msword': 'file/doc',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'file/xlsx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'file/docx',
    'application/pdf': 'file/pdf',
    'image/png': 'image/png',
    'image/jpg': 'image/jpg',
    'image/jpeg': 'image/jpeg',
  }

  return type[mimeList]
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const dateSubtractWeekDayOnly = (dataDate, length = 0) => {
  let dayPlusSla = dayjs(dataDate).add(length, 'day').get('day');
  const weekCount = Math.floor(length / 7) * 2
  if ([0, 6].includes(dayPlusSla)) {
    return dayjs(dataDate).add(length + weekCount + 2, 'day').format('MMM DD, YYYY');
  }
  return dayjs(dataDate).add(length + weekCount, 'day').format('MMM DD, YYYY');
};
