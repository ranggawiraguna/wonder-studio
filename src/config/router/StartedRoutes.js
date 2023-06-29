import { Navigate, Route } from 'react-router-dom';
import LoginPage from 'containers/pages/Common/LoginPage';
import StartedPage from 'containers/pages/Common/StartedPage';
import ValidateLogin from 'utils/other/ValidateLogin';
import RegisterPage from 'containers/pages/Common/RegisterPage';

const StartedRoutes = [
  <Route key="ValidateLogin" element={<ValidateLogin />}>
    <Route key="Login Page" exact path="/masuk" element={<LoginPage />} />
  </Route>,
  <Route key="Register Page" profile path="/daftar" element={<RegisterPage />} />,
  <Route key="Started Page" exact path="/" replace element={<Navigate to="profile" />} />,
  ['beranda', 'profile', 'service', 'product', 'product/:id', 'contact'].map((path) => <Route exact path={`/${path}`} element={<StartedPage />} />)
];

export default StartedRoutes;
