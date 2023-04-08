import { Route } from 'react-router-dom';
import LoginPage from 'containers/pages/Common/LoginPage';
import StartedPage from 'containers/pages/Common/StartedPage';
import ValidateLogin from 'utils/other/ValidateLogin';
import RegisterPage from 'containers/pages/Common/RegisterPage';

const StartedRoutes = [
  <Route exact key="Started Page" path="/" element={<StartedPage />} />,
  <Route key="ValidateLogin" element={<ValidateLogin />}>
    <Route key="Login Page" exact path="/masuk" element={<LoginPage />} />
  </Route>,
  <Route exact key="Register Page" path="/daftar" element={<RegisterPage />} />,
];

export default StartedRoutes;
