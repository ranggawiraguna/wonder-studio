import { Navigate, Route } from 'react-router-dom';
import DashboardPage from 'containers/pages/Admin/DashboardPage';
import AuthenticationPage from 'containers/pages/Admin/AuthenticationPage';
import ProductListPage from 'containers/pages/Admin/ProductListPage';
import ProductViewPage from 'containers/pages/Admin/ProductViewPage';
import ProductEditPage from 'containers/pages/Admin/ProductEditPage';
import ProductAddPage from 'containers/pages/Admin/ProductAddPage';
import OrderListPage from 'containers/pages/Admin/OrderListPage';
import OrderViewPage from 'containers/pages/Admin/OrderViewPage';
import ProfilePage from 'containers/pages/Common/ProfilePage';

const AdminRoutes = [
  <Route key="/admin" exact path="/admin" replace element={<Navigate to="dashboard" />} />,
  <Route key="/admin/dashboard" path="dashboard" element={<DashboardPage />} />,
  <Route key="/admin/authentication" path="authentication" element={<AuthenticationPage />} />,
  <Route key="/admin/product" path="product" element={<ProductListPage />} />,
  <Route key="/admin/product" path="product">
    <Route key="/admin/product/add" path="add" element={<ProductAddPage />} />
    <Route key="/admin/product/view" exact path="view" replace element={<Navigate to="./../" />} />
    <Route key="/admin/product/view/:id" path="view/:id" element={<ProductViewPage />} />
    <Route key="/admin/product/edit" exact path="edit" replace element={<Navigate to="./../" />} />
    <Route key="/admin/product/edit/:id" path="edit/:id" element={<ProductEditPage />} />
  </Route>,
  <Route key="/admin/order" path="order" element={<OrderListPage />} />,
  <Route key="/admin/order" path="order">
    <Route key="/admin/order/view" exact path="view" replace element={<Navigate to="./../" />} />
    <Route key="/admin/order/view/:id" exact path="view/:id" element={<OrderViewPage />} />
  </Route>,
  <Route key="/admin/profile" path="profile" element={<ProfilePage />} />
];

export default AdminRoutes;
