import { Box, Grid, Rating, Typography } from '@mui/material';
import { Fragment, useEffect, useState } from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import Spacer from 'components/elements/Spacer';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'config/firebase';
import { useParams } from 'react-router';
import { defaultProductImage } from 'utils/other/EnvironmentValues';
import DialogAddOrder from 'components/views/DialogActionOrder/AddOrder';
import AlertToast from 'components/elements/AlertToast';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState({
    name: '',
    price: 0,
    description: '',
    images: [defaultProductImage, defaultProductImage, defaultProductImage],
    uom: '',
    minimalOrder: '',
    models: [],
    sizes: [],
    rating: []
  });

  const [imageSelected, setImageSelected] = useState(0);
  const [modelSelected, setModelSelected] = useState(null);
  const [sizeSelected, setSizeSelected] = useState(null);
  const [countCart, setCountCart] = useState(0);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const [openDialogAddOrderType, setOpenDialogAddOrderType] = useState('');
  const [openDialogAddOrder, setOpenDialogAddOrder] = useState(false);

  const currentPrice =
    product.price ??
    (sizeSelected != null && modelSelected != null
      ? (product.prices ?? []).find((_) => (_.fields ?? []).includes(sizeSelected) && (_.fields ?? []).includes(modelSelected)) ?? {
          value: null
        }
      : (product.prices ?? []).find((_) => (_.fields ?? []).includes(sizeSelected) || (_.fields ?? []).includes(modelSelected)) ?? {
          value: null
        }
    ).value;

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  useEffect(() => {
    const listenerProduct = onSnapshot(doc(db, 'products', params.id), (snapshot) => {
      if (snapshot.exists()) {
        setProduct({
          id: snapshot.id,
          ...snapshot.data(),
          images: Array.from(Array(3).keys()).map((_, __) => (snapshot.data().images ?? [])[__] ?? defaultProductImage)
        });
      } else {
        setProduct(null);
      }
    });

    return () => {
      listenerProduct();
    };
  }, [params.id]);

  return (
    <Fragment>
      <Grid container spacing={{ xs: 0, sm: 2 }} sx={{ paddingTop: { xs: '20px', sm: 0 } }}>
        <Grid item xs={12} sm={5}>
          <Box sx={{ minHeight: { md: 'calc(100vh - 130px)' }, marginBottom: { xs: 3, md: 0 } }}>
            <Box sx={{ width: '100%', position: 'relative' }}>
              <Box
                sx={{
                  aspectRatio: 1,
                  borderRadius: 3,
                  width: 'calc(100% - 50px)',
                  backgroundColor: 'lightgrey',
                  margin: '0 auto',
                  border: '2px solid white',
                  outline: '2px solid white',
                  backgroundImage: `url(${product.images[imageSelected]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              <Box
                onClick={() => setImageSelected((imageSelected + (imageSelected > 0 ? 0 : 3) - 1) % 3)}
                sx={{
                  position: 'absolute',
                  aspectRatio: 1,
                  width: 50,
                  backgroundColor: 'white',
                  boxShadow: '1px 2px 2px 0 rgba(0,0,0,0.1)',
                  borderRadius: 1000,
                  top: '50%',
                  left: 0,
                  cursor: 'pointer',
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: 1
                }}
              >
                <ArrowBackIosIcon />
              </Box>
              <Box
                onClick={() => setImageSelected((imageSelected + 1) % 3)}
                sx={{
                  position: 'absolute',
                  aspectRatio: 1,
                  width: 50,
                  cursor: 'pointer',
                  backgroundColor: 'white',
                  boxShadow: '1px 2px 2px 0 rgba(0,0,0,0.1)',
                  borderRadius: 1000,
                  top: '50%',
                  right: 0,
                  transform: 'translateY(-50%)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingLeft: 0.3
                }}
              >
                <ArrowForwardIosIcon />
              </Box>
            </Box>
            <Box sx={{ padding: '0 25px', marginTop: 2, display: 'flex', gap: 2 }}>
              {product.images.map((_, __) => (
                <Box
                  key={__}
                  onClick={() => setImageSelected(__)}
                  sx={{
                    ...{
                      borderRadius: 3,
                      flex: 1,
                      aspectRatio: 1,
                      width: '100%',
                      cursor: 'pointer',
                      backgroundColor: 'lightgrey',
                      backgroundImage: `url(${product.images[__]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    },
                    ...(imageSelected === __
                      ? { opacity: 1, border: '2px solid white', outline: '2px solid white' }
                      : { opacity: 0.5, border: '2px solid rgba(255,255,255,0.5)', outline: '2px solid rgba(255,255,255,0.5)' })
                  }}
                />
              ))}
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12} sm={7}>
          <Box sx={{ minHeight: { md: 'calc(100vh - 130px)' }, padding: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h1" sx={{ marginBottom: 1 }}>
              {stringCapitalize(product.name)}
            </Typography>
            <Typography variant="h2" sx={{ color: 'rgba(0,0,0,0.5)' }}>
              {currentPrice == null
                ? product.price != null
                  ? moneyFormatter(product.price)
                  : product.prices != null
                  ? product.prices.length > 1
                    ? `${moneyFormatter(Math.min(...product.prices.map((_) => _.value)))}  s/d  ${moneyFormatter(
                        Math.max(...product.prices.map((_) => _.value))
                      )}`
                    : product.prices.length > 0
                    ? moneyFormatter(product.prices[0])
                    : 'Rp. -'
                  : 'Rp. -'
                : moneyFormatter(currentPrice)}
            </Typography>
            <Box sx={{ height: '1px', width: '100%', backgroundColor: 'lightgrey', marginTop: 2, marginBottom: 2 }} />
            <Typography variant="h4" sx={{ marginBottom: 1 }}>
              Description
            </Typography>
            <Typography variant="h5">
              {(product.description ?? '').toString().length > 0 ? product.description : 'Tidak Ada Deskripsi'}
            </Typography>
            <Spacer />
            <Typography variant="h4" sx={{ marginBottom: 1 }}>
              Satuan Jumlah
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              {stringCapitalize(product.uom ?? '-')}
            </Typography>
            <Typography variant="h4" sx={{ marginBottom: 1 }}>
              Minimal Order
            </Typography>
            <Typography variant="h5" sx={{ marginBottom: 1 }}>
              {stringCapitalize((product.minimalOrder ?? '-') + (product.minimalOrder ? ` ${product.uom}` : ''))}
            </Typography>
            <Box sx={{  marginTop: 3.5 }}>
              <Box
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  backgroundColor: 'white',
                  border: '2px solid rgba(0,0,0,0.1)',
                  outline: '2px solid rgba(0,0,0,0.1)',
                  padding: 1
                }}
              >
                <Typography variant="h4">Penilaian Produk</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box display={{ flex: 1 }}>
                    <Rating name="read-only" value={product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0} precision={0.1} readOnly />
                    <Typography
                      variant="h5"
                      sx={{ marginLeft: product.rating.length > 0 ? { sm: 0.5 } : {}, marginTop: product.rating.length > 0 ? 1 : 0 }}
                    >
                      Keterangan :
                      {(() => {
                        if (product.rating.length > 0) {
                          if ((product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0) <= 1) {
                            return 'Sangat Kurang';
                          } else if ((product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0) <= 2) {
                            return 'Kurang';
                          } else if ((product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0) <= 3) {
                            return 'Cukup';
                          } else if ((product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0) <= 4) {
                            return 'Baik';
                          } else {
                            return 'Sangat Baik';
                          }
                        } else {
                          return 'Belum Ada';
                        }
                      })()}
                    </Typography>
                  </Box>
                  <Typography variant="h1" sx={{ padding: 1, fontSize: 42 }}>
                    {product.rating.reduce((a, b) => a + b.rateValue, 0) ?? 0}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <DialogAddOrder
        open={openDialogAddOrder}
        type={openDialogAddOrderType}
        showAlert={showAlertToast}
        currentPrice={currentPrice}
        data={{
          product: product,
          sizeSelected: sizeSelected,
          modelSelected: modelSelected,
          countCart: countCart
        }}
        onClose={(isSuccess) => {
          if (isSuccess) {
            setSizeSelected(null);
            setModelSelected(null);
            setCountCart(0);
          }
          setOpenDialogAddOrderType('');
          setOpenDialogAddOrder(false);
        }}
      />
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}
