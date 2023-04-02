import * as actionTypes from '../action';

export const initialState = {
  isOpen: [], 
  fontFamily: 'Folks',
  borderRadius: 12,
  opened: true
};

const sidebarReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id]
      };

    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };

    default:
      return state;
  }
};

export default sidebarReducer;
