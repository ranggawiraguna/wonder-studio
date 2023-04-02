/* eslint-disable react-hooks/exhaustive-deps */
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'config/firebase';
import { restoreSession } from 'utils/redux/reducers/account';

export default function ManagerAccount() {
  const dispatch = useDispatch();
  const accountReducer = useSelector((state) => state.accountReducer);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user && accountReducer.username === null) {
        dispatch(restoreSession({ username: user.displayName }));
      }
    });
  }, []);

  return <Outlet />;
}
