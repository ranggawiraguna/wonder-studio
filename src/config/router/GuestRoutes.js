import { Navigate, Route } from 'react-router-dom';
import ProductListPage from 'containers/pages/Common/ProductListPage';
import ProductDetailPage from 'containers/pages/Common/ProductDetailPage';

const GuestRoutes = [
  <Route key="/guest" exact path="/guest" replace element={<Navigate to="product" />} />,
  <Route key="/guest/product" path="/guest/product" element={<ProductListPage />} />,
  <Route key="/guest/product/:id" path="/guest/product/:id" element={<ProductDetailPage />} />,
];

export default GuestRoutes;
