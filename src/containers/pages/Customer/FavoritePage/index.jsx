import PageRoot from './styled';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';

export default function FavoritePage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'favorite') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'favorite' });
    }
    return () => {
      //
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageRoot>
        <></>
      </PageRoot>
    </Fragment>
  );
}