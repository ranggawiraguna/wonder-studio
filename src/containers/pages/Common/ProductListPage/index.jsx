import ProductCard from 'components/elements/CardProduct';
import PageRoot from './styled';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN, SET_ACTIVE } from 'utils/redux/action';
import { Grid } from '@mui/material';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'config/firebase';

export default function ProductListPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'product') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'product' });
    }
    const listenerProducts = onSnapshot(query(collection(db, 'products'), orderBy('name')), (snapshot) =>
      setProducts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );

    dispatch({ type: SET_ACTIVE, status: true });

    return () => {
      listenerProducts();
      dispatch({ type: SET_ACTIVE, status: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageRoot>
        <Grid container spacing={2}>
          {(() =>
            products.map((_) => (
              <Grid item xs={12} sm={6} md={4} lg={3} alignContent="center">
                <ProductCard disableFavorite product={_} />
              </Grid>
            )))()}
        </Grid>
      </PageRoot>
    </Fragment>
  );
}
