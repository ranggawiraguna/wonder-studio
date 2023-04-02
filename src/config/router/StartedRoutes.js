import { Route } from 'react-router-dom';
import LoginPage from 'containers/pages/Common/LoginPage';
import StartedPage from 'containers/pages/Common/StartedPage';
import ValidateLogin from 'utils/other/ValidateLogin';
import RegisterPage from 'containers/pages/Common/RegisterPage';

const StartedRoutes = [
  <Route exact path="/" key="/" element={<StartedPage />} />,
  <Route element={<ValidateLogin />}>
    <Route exact path="/masuk" element={<LoginPage />} />
  </Route>,
  <Route exact path="/daftar" element={<RegisterPage />} />,
];

export default StartedRoutes;
