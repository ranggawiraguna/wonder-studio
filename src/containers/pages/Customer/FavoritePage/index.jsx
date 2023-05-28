import { Grid } from '@mui/material';
import PageRoot from './styled';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import ProductCard from 'components/elements/CardProduct';

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
        <Grid container spacing={2}>
          {Array.from(Array(10).keys()).map(() => (
            <Grid item xs={12} sm={6} md={4} lg={3} alignContent="center">
              <ProductCard favorite/>
            </Grid>
          ))}
        </Grid>
      </PageRoot>
    </Fragment>
  );
}
