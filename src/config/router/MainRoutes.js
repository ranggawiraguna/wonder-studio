import { Route } from 'react-router-dom';
import ErrorPage from 'containers/pages/Common/ErrorPage';
import CustomerRoutes from './CustomerRoutes';
import AdminRoutes from './AdminRoutes';
import StartedContainer from 'containers/templates/StartedLayout';
import StartedRoutes from './StartedRoutes';
import MainLayout from 'containers/templates/MainLayout';
import ValidateSession from 'utils/other/ValidateSession';
import ManagerAccount from 'utils/other/ManagerAccount';

const MainRoutes = [
  <Route key="Manager Account" element={<ManagerAccount />}>
    <Route key="Started Routes" path="/" element={<StartedContainer />} children={StartedRoutes} />,
    <Route key="Content Routes" element={<ManagerAccount />}>
      <Route key="Main Layout" element={<MainLayout />}>
        <Route key="Admin" path="admin" element={<ValidateSession role="admin" />} children={AdminRoutes} />
        <Route key="Customer" path="customer" element={<ValidateSession role="customer" />} children={CustomerRoutes} />
      </Route>
    </Route>
  </Route>,
  <Route key="Not Found" path="*" element={<ErrorPage />} />
];

export default MainRoutes;
