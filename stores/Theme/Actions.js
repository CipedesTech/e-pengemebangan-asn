import { createActions } from 'reduxsauce';

const { Types, Creators } = createActions({
  toggleSidebar: ['sidebarCollapse'],
  toggleMobileNav: ['mobileNav'],
  setAvatarBackground: ['avatarBackground'],
  resetTheme: null,
});

export const ThemeTypes = Types;
export default Creators;
