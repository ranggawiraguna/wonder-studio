import { combineReducers } from 'redux';
import sidebarReducer from 'utils/redux/reducers/sidebar';
import accountReducer from 'utils/redux/reducers/account';
import searchReducer from 'utils/redux/reducers/search';

const reducer = combineReducers({
  sidebarReducer: sidebarReducer,
  accountReducer: accountReducer,
  searchReducer: searchReducer
});

export default reducer;
