/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createReducer } from 'reduxsauce';
import { INITIAL_STATE } from './InitialState';
import { ThemeTypes } from './Actions';

export const toggleSidebar = (state, action) => ({
  ...state,
  sidebarCollapse: action.sidebarCollapse,
});

export const toggleMobileNav = (state, action) => ({
  ...state,
  mobileNav: action.mobileNav,
});

export const setAvatarBackground = (state, action) => ({
  ...state,
  avatarBackground: action.avatarBackground,
});

export const resetTheme = () => INITIAL_STATE;

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [ThemeTypes.TOGGLE_SIDEBAR]: toggleSidebar,
  [ThemeTypes.TOGGLE_MOBILE_NAV]: toggleMobileNav,
  [ThemeTypes.SET_AVATAR_BACKGROUND]: setAvatarBackground,
  [ThemeTypes.RESET_THEME]: resetTheme,
});
