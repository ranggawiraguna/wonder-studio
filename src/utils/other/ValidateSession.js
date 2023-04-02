/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ValidateSession(props) {
  let navigate = useNavigate();

  const accountReducer = useSelector((state) => state.accountReducer);

  const [Page, setPage] = useState(<></>);
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    if (accountReducer.isLogin !== null && !sessionChecked) {
      if (accountReducer.isLogin === false) {
        navigate('/masuk');
      } else {
        if (accountReducer.role === props.role) {
          setSessionChecked(true);
          setPage(<Outlet />);
        } else {
          navigate('/error');
        }
      }
    }
  });

  return Page;
}
