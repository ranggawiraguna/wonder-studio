import { Navigate, Route } from 'react-router-dom';
import ProfilePage from 'containers/pages/Common/ProfilePage';
import HomePage from 'containers/pages/Customer/HomePage';
import CartPage from 'containers/pages/Customer/CartPage';
import FavoritePage from 'containers/pages/Customer/FavoritePage';
import HistoryOrderPage from 'containers/pages/Customer/HistoryOrderPage';
import OrderListPage from 'containers/pages/Customer/OrderListPage';
import OrderViewPage from 'containers/pages/Customer/OrderViewPage';
import ProductDetailPage from 'containers/pages/Customer/ProductDetailPage';

const CustomerRoutes = [
  <Route key="/customer" exact path="/customer" replace element={<Navigate to="product" />} />,
  <Route key="/customer/product" path="product" element={<HomePage />} />,
  <Route key="/customer/product/:id" path="/customer/product/:id" element={<ProductDetailPage />} />,
  <Route key="/customer/cart" path="cart" element={<CartPage />} />,
  <Route key="/customer/favorite" path="favorite" element={<FavoritePage />} />,
  <Route key="/customer/history" path="history" element={<HistoryOrderPage />} />,
  <Route key="/customer/history" path="history">
    <Route key="/customer/history/view" exact path="view" replace element={<Navigate to="./../" />} />
    <Route key="/customer/history/view/:id" exact path="view/:id" element={<OrderViewPage />} />
  </Route>,
  <Route key="/customer/profile" path="profile" element={<ProfilePage />} />,
  <Route key="/customer/order" path="order" element={<OrderListPage />} />,
  <Route key="/customer/order" path="order">
    <Route key="/customer/order/view" exact path="view" replace element={<Navigate to="./../" />} />
    <Route key="/customer/order/view/:id" exact path="view/:id" element={<OrderViewPage />} />
  </Route>,
];

export default CustomerRoutes;
