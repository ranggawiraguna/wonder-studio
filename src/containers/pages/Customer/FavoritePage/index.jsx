import { Grid } from '@mui/material';
import PageRoot from './styled';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import ProductCard from 'components/elements/CardProduct';
import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'config/firebase';

export default function FavoritePage() {
  const dispatch = useDispatch();
  const accountReducer = useSelector((state) => state.accountReducer);
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [products, setProducts] = useState([]);
  const [customer, setCustomer] = useState({});

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'favorite') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'favorite' });
    }
    const listenerProducts = onSnapshot(query(collection(db, 'products'), orderBy('name')), (snapshot) =>
      setProducts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );
    const listenerCustomer = onSnapshot(doc(db, 'customers', accountReducer.id), (snapshot) => {
      if (snapshot.exists()) {
        setCustomer({
          id: snapshot.id,
          ...snapshot.data()
        });
      } else {
        setCustomer(null);
      }
    });

    return () => {
      listenerProducts();
      listenerCustomer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageRoot>
        <Grid container spacing={2}>
          {(() =>
            products.filter((_)=> Array.from(customer.favorites ??[]).includes(_.id)).map((_) => (
              <Grid item xs={12} sm={6} md={4} lg={3} alignContent="center">
                <ProductCard favorites={customer.favorites ?? []} product={_} />
              </Grid>
            )))()}
        </Grid>
      </PageRoot>
    </Fragment>
  );
}
