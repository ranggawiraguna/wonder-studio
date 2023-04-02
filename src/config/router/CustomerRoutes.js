import { Navigate, Route } from 'react-router-dom';
import ProfilePage from 'containers/pages/Common/ProfilePage';
import HomePage from 'containers/pages/Customer/HomePage';
import MyOrderPage from 'containers/pages/Customer/MyOrderPage';
import MyCartPage from 'containers/pages/Customer/MyCartPage';
import MyFavoritePage from 'containers/pages/Customer/MyFavoritePage';
import HistoryOrderPage from 'containers/pages/Customer/HistoryOrderPage';

const CustomerRoutes = [
  <Route key="/customer" exact path="/customer" replace element={<Navigate to="dashboard" />} />,
  <Route key="/customer/dashboard" path="dashboard" element={<HomePage />} />,
  <Route key="/customer/order" path="order" element={<MyOrderPage />} />,
  <Route key="/customer/cart" path="cart" element={<MyCartPage />} />,
  <Route key="/customer/favorite" path="favorite" element={<MyFavoritePage />} />,
  <Route key="/customer/history" path="history" element={<HistoryOrderPage />} />,
  <Route key="/customer/profile" path="profile" element={<ProfilePage />} />
];

export default CustomerRoutes;
