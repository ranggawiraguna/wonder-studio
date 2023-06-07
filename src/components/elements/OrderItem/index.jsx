import { Box, Typography } from '@mui/material';
import { db } from 'config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import Component from './styled';

export default function OrderItem({ data, ...props }) {
  const [product, setProduct] = useState({
    id: '',
    category: '',
    description: '',
    name: '',
    price: 0,
    images: ['', '', ''],
    sizes: [],
    models: [],
    sold: 0
  });

  useEffect(() => {
    const listenerProduct = onSnapshot(doc(db, 'products', data.productId), (snapshot) => {
      if (snapshot.exists()) {
        setProduct({
          id: snapshot.id,
          ...snapshot.data()
        });
      }
    });

    return () => {
      listenerProduct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Component
        gridTemplateAreas={{
          xs: `
            "A B B"
            "A C C"
            "A D D"
            "A E E"
            "F F F"
          `,
          sm: `
            "A B B"
            "A C C"
            "A D D"
            "A E F"
          `
        }}
        gridTemplateColumns={'auto 1fr auto'}
      >
        <Box
          gridArea="A"
          sx={{
            backgroundImage: `url(${product.images[0]})`,
            backgroundRepeat: 'no-repeat'
          }}
        />
        <Typography gridArea="B" variant="p" component="p">
          {product.name}
        </Typography>
        <Box gridArea="C">
          {data.model ? (
            <>
              <Typography variant="p" component="p">
                Model :
              </Typography>
              <Typography variant="p" component="p">
                {stringCapitalize(data.model)}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Box gridArea="D">
          {data.size ? (
            <>
              <Typography variant="p" component="p">
                Ukuran :
              </Typography>
              <Typography variant="p" component="p">
                {stringCapitalize(data.size)}
              </Typography>
            </>
          ) : (
            <></>
          )}
        </Box>
        <Typography gridArea="E" variant="p" component="p">
          Jumlah : {data.count}
        </Typography>
        <Typography gridArea="F" variant="p" component="p">
          {moneyFormatter(data.price)}
        </Typography>
      </Component>
    </Fragment>
  );
}
