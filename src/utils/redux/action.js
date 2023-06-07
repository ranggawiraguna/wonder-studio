import accountAction from './actions/account';
import sidebarAction from './actions/sidebar';
import searchAction from './actions/search';

// account action
export const RESTORE_SESSION = accountAction.RESTORE_SESSION;
export const CLEAR_SESSION = accountAction.CLEAR_SESSION;

// sidebar action
export const SET_MENU = sidebarAction.SET_MENU;
export const MENU_TOGGLE = sidebarAction.MENU_TOGGLE;
export const MENU_OPEN = sidebarAction.MENU_OPEN;

// search action
export const SET_ACTIVE = searchAction.SET_ACTIVE;
export const SET_VALUE = searchAction.SET_VALUE;
