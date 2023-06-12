import PerfectScrollbar from 'react-perfect-scrollbar';
import React, { useState } from 'react';
import { Box, Button, FormControl, FormControlLabel, Grid, InputLabel, OutlinedInput, Radio, RadioGroup, Typography } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import EastIcon from '@mui/icons-material/East';
import { moneyFormatter } from 'utils/other/Services';
import Spacer from 'components/elements/Spacer';
import { collection, deleteDoc, doc, onSnapshot, query, setDoc, where } from 'firebase/firestore';
import { db, storage } from 'config/firebase';
import { defaultProductImage, orderProcess } from 'utils/other/EnvironmentValues';
import CartCard from 'components/elements/CartCard';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import AlertToast from 'components/elements/AlertToast';

export default function CartPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const accountReducer = useSelector((state) => state.accountReducer);

  const [isAddOrderProcess, setAddOrderProcess] = useState(false);
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phoneNumber: '',
    deliveryType: 'cod'
  });

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const currentPrice = carts.reduce((total, cart) => {
    const product = products.find((product) => product.id === cart.productId) ?? {
      images: [defaultProductImage],
      models: [],
      sizes: []
    };
    return (
      total +
      parseInt(
        product != null
          ? product.price ??
              (cart.size != null && cart.model != null
                ? (product.prices ?? []).find((_) => (_.fields ?? []).includes(cart.size) && (_.fields ?? []).includes(cart.model)) ?? {
                    value: 0
                  }
                : (product.prices ?? []).find((_) => (_.fields ?? []).includes(cart.size) || (_.fields ?? []).includes(cart.model)) ?? {
                    value: 0
                  }
              ).value
          : 0
      )
    );
  }, 0);

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const handleOnChangeForm = (prop) => (event) => {
    setOrderForm({ ...orderForm, [prop]: event.target.value });
  };

  const handleAddOrder = async () => {
    if (!isAddOrderProcess) {
      if (Object.keys(orderForm).every((_) => Boolean(orderForm[_]))) {
        setAddOrderProcess(true);

        const reference = doc(collection(db, `orders`));

        setDoc(reference, {
          customerId: accountReducer.id,
          dateCreated: new Date(),
          products: await Promise.all(
            await Promise.all(
              carts.map(async (cart) => ({
                productId: cart.productId,
                count: cart.count,
                price: (() => {
                  const product = products.find((_) => _.id === cart.productId);
                  return (
                    product.price ??
                    (cart.size != null && cart.model != null
                      ? (product.prices ?? []).find(
                          (_) => (_.fields ?? []).includes(cart.size) && (_.fields ?? []).includes(cart.model)
                        ) ?? {
                          value: null
                        }
                      : (product.prices ?? []).find(
                          (_) => (_.fields ?? []).includes(cart.size) || (_.fields ?? []).includes(cart.model)
                        ) ?? {
                          value: null
                        }
                    ).value
                  );
                })(),
                images: await Promise.all(
                  cart.images.map(async (image, imageIndex) => {
                    const imageUrl = await getDownloadURL(
                      (
                        await uploadBytes(
                          ref(storage, `/order-images/${reference.id}-${cart.id}-image${imageIndex}`),
                          (await fetch(image)).blob()
                        )
                      ).ref
                    );

                    return imageUrl;
                  })
                ),
                ...(cart.size ? { size: cart.size } : {}),
                ...(cart.model ? { model: cart.model } : {})
              }))
            )
          ),
          ...orderForm,
          processTracking: [
            { name: orderProcess.orderCreate, date: new Date() },
            ...(orderForm.deliveryType === 'cod' ? [{ name: orderProcess.waitingPayment, date: new Date() }] : [{}])
          ]
        })
          .catch(() => {
            setAddOrderProcess(false);
            showAlertToast('warning', `Terjadi kesalahan, gagal menambahkan produk ke pesanan`);
          })
          .then(() => {
            setAddOrderProcess(false);
            setOrderForm({
              name: '',
              phoneNumber: '',
              deliveryType: 'cod'
            });
            [...carts].forEach((cart) => {
              cart.images.forEach((_, __) => deleteObject(ref(storage, `/cart-images/${cart.id}-image${__}`)));
              deleteDoc(doc(db, 'carts', cart.id));
            });
            showAlertToast('success', `Berhasil menambahkan produk ke pesanan`);
          });
      } else {
        showAlertToast('warning', 'Silahkan lengkapi formulir pesanan dengan benar');
      }
    }
  };

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'cart') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'cart' });
    }
    const listenerCarts = onSnapshot(query(collection(db, 'carts'), where('customerId', '==', accountReducer.id)), (snapshot) =>
      setCarts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );
    return () => {
      listenerCarts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (carts.length > 0) {
      const listenerProducts = onSnapshot(collection(db, 'products'), (snapshot) =>
        setProducts(
          snapshot.docs
            .filter((_) => carts.map((_) => _.productId).includes(_.id))
            .map((document) => ({ id: document.id, ...document.data() }))
        )
      );

      return () => {
        listenerProducts();
      };
    }
  }, [carts]);

  useEffect(()=>{
    if(orderForm.deliveryType === 'cod'){
      delete orderForm.address;
    } else {
      setOrderForm({
        ...orderForm,
        address : '',
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderForm.deliveryType]);

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 5,
              width: '100%',
              height: 'calc(100vh - 130px)',
              display: 'flex',
              paddingLeft: 3,
              paddingRight: 1,
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h3" sx={{ marginBottom: 1.5, marginTop: 3, marginRight: 1 }}>
              Keranjang Saya
            </Typography>
            <Box sx={{ backgroundColor: 'whitesmoke', height: '2px', borderRadius: 10, marginRight: 2 }} />
            <PerfectScrollbar style={{ marginLeft: 3, marginRight: 1, paddingRight: 3, paddingBottom: 2, flex: 1, overflow: 'auto' }}>
              <Spacer />
              {carts.map((_, __) => (
                <CartCard
                  key={__}
                  cart={_}
                  product={products.find((product) => product.id === _.productId) ?? { images: [defaultProductImage] }}
                />
              ))}
            </PerfectScrollbar>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <PerfectScrollbar>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.75)',
                borderRadius: 5,
                width: '100%',
                height: 'calc(100vh - 130px)',
                padding: 3,
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h3" sx={{ marginBottom: 1.5 }}>
                Detail Pesanan
              </Typography>
              <Box sx={{ backgroundColor: 'whitesmoke', height: '2px', borderRadius: 10 }} />
              <Spacer />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h4">Penerima</Typography>
                  <FormControl variant="outlined" className="input" sx={{ marginBottom: 1 }}>
                    <InputLabel htmlFor="InputFullname">Nama Lengkap</InputLabel>
                    <OutlinedInput
                      id="InputFullname"
                      type="name"
                      value={orderForm.name}
                      onChange={handleOnChangeForm('name')}
                      label="Nama Lengkap"
                      placeholder="Masukkan Nama Lengkap"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormControl variant="outlined" className="input">
                    <InputLabel htmlFor="InputPhoneNumber">Nomor Telepon</InputLabel>
                    <OutlinedInput
                      id="InputPhoneNumber"
                      type="phone"
                      value={orderForm.phoneNumber}
                      onChange={handleOnChangeForm('phoneNumber')}
                      label="Nomor Telepon"
                      placeholder="Masukkan Nomor Telepon"
                      autoComplete="off"
                    />
                  </FormControl>
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography variant="h4">Pengiriman</Typography>
                  <FormControl>
                    <RadioGroup onChange={handleOnChangeForm('deliveryType')} value={orderForm.deliveryType}>
                      <FormControlLabel value="cod" control={<Radio />} label="Ambil Pesanan Ke Toko" />
                      <FormControlLabel value="ship" control={<Radio />} label="Antar Ke Alamat Tujuan" />
                    </RadioGroup>
                  </FormControl>
                  {orderForm.deliveryType === 'ship' ? (
                    <FormControl variant="outlined" className="input">
                      <InputLabel htmlFor="InputAddress">Alamat Lengkap</InputLabel>
                      <OutlinedInput
                        id="InputAddress"
                        type="text"
                        value={orderForm.address}
                        onChange={handleOnChangeForm('address')}
                        label="Alamat Lengkap"
                        placeholder="Masukkan Alamat Lengkap"
                        autoComplete="off"
                      />
                    </FormControl>
                  ) : (
                    <></>
                  )}
                </Box>
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ height: '1px', width: '100%', backgroundColor: 'lightgrey', marginBottom: 2 }} />
              <Typography variant="h4" sx={{ marginBottom: 1 }}>
                Total Pesanan
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Jumlah Produk
                </Typography>
                <Typography variant="h5" sx={{ flex: 1, textAlign: 'end', fontWeight: 'bold' }}>
                  {carts.reduce((a, b) => a + b.count, 0)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Jumlah Harga
                </Typography>
                <Typography variant="h5" sx={{ flex: 1, textAlign: 'end', fontWeight: 'bold' }}>
                  {moneyFormatter(currentPrice)}
                </Typography>
              </Box>
              <Button
                variant="contained"
                sx={{ display: 'flex', gap: '10px', padding: '10px 25px', marginTop: 2 }}
                onClick={handleAddOrder}
              >
                <Typography variant="h4" sx={{ color: 'white', flex: 1, textAlign: 'start' }}>
                  Buat Pesanan
                </Typography>
                <EastIcon />
              </Button>
            </Box>
          </PerfectScrollbar>
        </Grid>
      </Grid>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}
