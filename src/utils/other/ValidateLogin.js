import { Outlet } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ValidateLogin() {
  let navigate = useNavigate();
  const accountReducer = useSelector((state) => state.accountReducer);

  useEffect(() => {
    if (accountReducer.isLogin === true) {
      switch (accountReducer.role) {
        case 'admin':
          return navigate('/admin/dashboard');

        case 'customer':
          return navigate('/customer/dashboard');

        default:
          break;
      }
    }
  });

  return <Outlet />;
}
