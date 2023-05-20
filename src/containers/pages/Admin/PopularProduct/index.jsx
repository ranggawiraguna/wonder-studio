import { Button, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import ChartSingle from 'components/elements/ChartSingle';
import { db } from 'config/firebase';
import TableDisplay from 'containers/templates/TableDisplay';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { defaultProductImage, tableDisplayType } from 'utils/other/EnvironmentValues';
import { MENU_OPEN } from 'utils/redux/action';
import PageRoot from './styled';

const tableHeadContent = ['Foto', 'Id & Nama Produk', 'Jumlah Terjual', 'Lainnya'];
const tableAlignContent = ['center', 'left', 'left', 'center'];
const chartColors = ['red', 'green', 'blue', 'yellow', 'purple'];

export default function PopularProductPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'popular-product') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'popular-product' });
    }

    const listenerProducts = onSnapshot(query(collection(db, 'products'), limit(5)), (snapshot) =>
      setProducts(
        snapshot.docs.map((document) => ({
          id: document.id,
          photo: document.data().images[0],
          name: document.data().name,
          sold: document.data().sold ?? 1
        }))
      )
    );

    return () => {
      listenerProducts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageRoot>
      <TableDisplay
        title="Produk Terlaris"
        withChart={true}
        chartViews={(() => {
          return [
            <ChartSingle
              id={`ChartProdukTerlaris`}
              type="pie"
              label={products.slice(0, 5).map((e) => e.name)}
              data={products.slice(0, 5).map((e) => e.sold)}
              colors={['#B11900', '#FFE779', '#6DAFA7', '#7BA7FF', '#B05AF3']}
            />,
            <Box>
              <Typography variant="h4" component="h4">
                Keterangan Diagram 5 Produk Terlaris
              </Typography>
              {(() => {
                return products.slice(0, 5).map((product, index) => (
                  <Box key={index}>
                    <Box
                      sx={{
                        backgroundColor: chartColors[index]
                      }}
                    />
                    <Typography variant="h5" component="h5">
                      {product.name}
                    </Typography>
                  </Box>
                ));
              })()}
            </Box>
          ];
        })()}
        tableContentType={tableDisplayType.card}
        tableAlignContent={tableAlignContent}
        tableHeadContent={tableHeadContent}
        tableBodyContent={(() => {
          return products.map((product, index) => (
            <Fragment key={`content-${index + 1}`}>
              <TableRow sx={{ height: index === 0 ? 20 : 8 }} />
              <TableRow key={`content-${index + 1}`} className="card">
                <TableCell align={tableAlignContent[0]} sx={{ width: '74px', padding: '7px' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: 'lightgrey',
                      borderRadius: '5px',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      backgroundImage: `url(${product.photo ? product.photo : defaultProductImage})`
                    }}
                  />
                </TableCell>
                <TableCell align={tableAlignContent[1]}>
                  <Typography variant="h4" component="h4">
                    {product.name}
                  </Typography>
                  <Typography variant="h5" component="h5">
                    ID : {product.id}
                  </Typography>
                </TableCell>
                <TableCell align={tableAlignContent[2]}>
                  <Typography variant="h5" component="h5" fontWeight="bold">
                    {product.sold}
                  </Typography>
                </TableCell>
                <TableCell align={tableAlignContent[3]}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      navigate(`/store/product/view/${product.id}`);
                    }}
                  >
                    Lihat Detail
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow sx={{ height: index === products.length - 1 ? 20 : 8 }} />
            </Fragment>
          ));
        })()}
      />
    </PageRoot>
  );
}
