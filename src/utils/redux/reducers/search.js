import * as actionTypes from '../action';

export const initialState = {
  isActive: false,
  value: ''
};

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE:
      return {
        ...state,
        isActive: action.status,
        value: ''
      };

    case actionTypes.SET_VALUE:
      return {
        ...state,
        value: action.value
      };

    default:
      return state;
  }
};

export default searchReducer;
