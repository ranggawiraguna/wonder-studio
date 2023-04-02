import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from 'app';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'utils/redux/store';
import 'assets/scss/style.scss';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  </React.StrictMode>
);
