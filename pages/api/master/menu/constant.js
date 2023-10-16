/* eslint-disable no-param-reassign */
import prisma from 'lib/prisma';

function transformMenuData(menuData) {
  const menuMap = new Map();

  menuData.forEach((item) => {
    item.sub_menu = [];
    if (item.allowedRole) {
      item.roles = JSON.parse(item.allowedRole);
    }
    menuMap.set(item.id, item);
  });

  const transformedMenu = [];
  menuData.forEach((item) => {
    if (item.parentId) {
      menuMap.get(item.parentId).sub_menu.push(item);
    } else {
      transformedMenu.push(item);
    }
  });

  return transformedMenu;
}

function sortMenusByOrder(menu) {
  if (menu.sub_menu && menu.sub_menu.length > 1) {
    menu.sub_menu.sort((a, b) => a.order - b.order);
    menu.sub_menu.forEach((subMenu) => {
      sortMenusByOrder(subMenu); // Recursively sort sub-menus
    });
  }
}

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const menuRaw = await prisma.m_menu_access.findMany();
      const menuConstant = transformMenuData(menuRaw);
      menuConstant.forEach((menu) => {
        sortMenusByOrder(menu);
      });
      return res.status(200).json({ message: 'Data Berhasil ditemukan', data: menuConstant });
    default:
      return res.status(404).json({ message: 'Not found', data: '' });
  }
}
