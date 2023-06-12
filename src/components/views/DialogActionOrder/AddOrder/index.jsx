/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  IconButton,
  Grid,
  Typography,
  Box,
  FormControl,
  OutlinedInput,
  InputLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from '@mui/icons-material/Cancel';
import { defaultProductImage, orderProcess } from 'utils/other/EnvironmentValues';
import { collection, doc, setDoc } from 'firebase/firestore';
import { db, storage } from 'config/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useSelector } from 'react-redux';

const InputImageComponent = (props) => (
  <>
    <input hidden id="file-attachment" accept="image/*" type="file" multiple onChange={props.onChange} />
    <label htmlFor="file-attachment">{props.children}</label>
  </>
);

const DialogAddOrder = forwardRef(({ open, onClose, type, data, currentPrice, showAlert, ...others }, widgetRef) => {
  const accountReducer = useSelector((state) => state.accountReducer);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isAddOrderProcess, setAddOrderProcess] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phoneNumber: '',
    deliveryType: 'cod'
  });

  const handleOnChangeForm = (prop) => (event) => {
    setOrderForm({ ...orderForm, [prop]: event.target.value });
  };

  const handleOnChangeImage = (event) => {
    if (Array.from(event.target?.files ?? []).length > 0) {
      setSelectedImage([...selectedImage, ...Array.from(event.target?.files ?? [])]);
    }
  };

  const handleNextSection = () => {
    if (selectedImage.length > 0) {
      setSectionIndex(1);
    } else {
      showAlert('warning', 'Silahkan masukkan gambar desain untuk melanjutkan');
    }
  };

  const handleDialogAction = async (actionName) => {
    setAddOrderProcess(true);

    const reference = doc(collection(db, `${actionName}s`));

    const imagesRef = [];
    let imageError = false;
    const images = await Promise.all(
      selectedImage.map(async (_, __) => {
        imagesRef.push(ref(storage, `/${actionName}-images/${reference.id}-image${__}`));
        try {
          return await getDownloadURL((await uploadBytes(imagesRef[imagesRef.length - 1], _)).ref);
        } catch {
          imagesRef.pop();
          imageError = true;
        }
      })
    );

    if (!imageError) {
      const item = {
        productId: data.product.id,
        count: data.countCart,
        images: images,
        ...(data.sizeSelected ? { size: data.sizeSelected } : {}),
        ...(data.modelSelected ? { model: data.modelSelected } : {}),
        ...(actionName === 'order' ? { price: (currentPrice ?? 0) * data.countCart } : {})
      };

      setDoc(reference, {
        customerId: accountReducer.id,
        dateCreated: new Date(),
        ...(actionName === 'cart' ? { images: images } : {}),
        ...(actionName === 'cart' ? item : { products: [item] }),
        ...(actionName === 'cart' ? {} : orderForm),
        ...(actionName === 'cart'
          ? {}
          : {
              processTracking: [
                { name: orderProcess.orderCreate, date: new Date() },
                ...(orderForm.deliveryType === 'cod' ? [{ name: orderProcess.waitingPayment, date: new Date() }] : [{}])
              ]
            })
      })
        .catch(() => {
          showAlert('warning', `Terjadi kesalahan, gagal menambahkan produk ke ${actionName === 'order' ? 'pesanan' : 'keranjang'}`);
          setAddOrderProcess(false);
          imagesRef.forEach((_) => deleteObject(_));
        })
        .then(() => {
          setAddOrderProcess(false);
          handleCloseDialog(true);
          showAlert('success', `Berhasil menambahkan produk ke ${actionName === 'order' ? 'pesanan' : 'keranjang'}`);
        });
    } else {
      showAlert('warning', `Terjadi kesalahan, gagal menambahkan produk ke ${actionName === 'order' ? 'pesanan' : 'keranjang'}`);
      setAddOrderProcess(false);
      imagesRef.forEach((_) => deleteObject(_));
    }
  };

  const handleAddCart = async () => {
    if (!isAddOrderProcess) {
      if (selectedImage.length > 0) {
        handleDialogAction('cart');
      } else {
        showAlert('warning', 'Silahkan masukkan gambar desain untuk melanjutkan');
      }
    }
  };

  const handleAddOrder = async () => {
    if (!isAddOrderProcess) {
      if (Object.keys(orderForm).every((_) => Boolean(orderForm[_]))) {
        handleDialogAction('order');
      } else {
        showAlert('warning', 'Silahkan lengkapi formulir pesanan dengan benar');
      }
    }
  };

  const handleCloseDialog = (isSuccess) => {
    if (!isAddOrderProcess) {
      onClose(isSuccess);
      selectedImage.forEach((_) => URL.revokeObjectURL(_));
      setAddOrderProcess(false);
      setSelectedImage([]);
      setOrderForm({
        name: '',
        phoneNumber: '',
        deliveryType: 'cod'
      });
      setSectionIndex(0);
    }
  };

  useEffect(() => {
    if (orderForm.deliveryType === 'cod') {
      delete orderForm.address;
    } else {
      setOrderForm({
        ...orderForm,
        address: ''
      });
    }
  }, [orderForm.deliveryType]);

  return (
    <Fragment>
      <Dialog
        fullWidth
        ref={ref}
        open={open}
        {...others}
        fullScreen={fullScreen}
        onClose={() => handleCloseDialog(false)}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Formulir Pesanan
            </Typography>
            <IconButton
              sx={{ position: 'absolute', right: 0, top: -12 }}
              color="inherit"
              onClick={() => handleCloseDialog(false)}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          {sectionIndex === 0 ? (
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1} alignItems="stretch">
                <Grid item xs={2.4} sm={2}>
                  <Box
                    sx={{
                      aspectRatio: 1,
                      backgroundColor: 'lightgrey',
                      borderRadius: 2,
                      width: '100%',
                      backgroundImage: `url(${
                        Array.from(data.product.images ?? []).length > 0 ? Array.from(data.product.images)[0] : defaultProductImage
                      })`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                </Grid>
                <Grid item xs={8.6} sm={10} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', padding: 1, width: '100%', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="h4"
                        sx={{
                          marginBottom: 0.5,
                          display: '-webkit-box',
                          WebkitLineClamp: '1',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'clip'
                        }}
                      >
                        {stringCapitalize(data.product.name)}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'grey', marginBottom: 1 }}>
                        {(data.modelSelected != null ? `${stringCapitalize(data.modelSelected)}, ` : '') +
                          (data.sizeSelected != null ? `${stringCapitalize(data.sizeSelected)}, ` : '') +
                          (data.countCart != null ? `${data.countCart} ${stringCapitalize(data.product.uom)}` : '')}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'grey' }}>
                        {moneyFormatter(currentPrice ?? 0)} / {stringCapitalize(data.product.uom)}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ marginBottom: 0.5, textAlign: 'end', paddingRight: 2, color: 'grey' }}>
                      {moneyFormatter((currentPrice ?? 0) * data.countCart)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <hr color="whitesmoke" />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                <Typography variant="h4">File Desain</Typography>
                {selectedImage.length > 0 ? (
                  <InputImageComponent onChange={handleOnChangeImage}>
                    <Button variant="text" component="span">
                      Tambah Gambar
                    </Button>
                  </InputImageComponent>
                ) : (
                  <></>
                )}
              </Box>
              {selectedImage.length > 0 ? (
                <Grid container spacing={1} sx={{ outline: '2px solid rgba(0,0,0,0.1)', borderRadius: 1, width: '100%', paddingBottom: 1 }}>
                  {selectedImage.map((_, __) => (
                    <Grid key={__} item xs={2}>
                      <Box
                        sx={{
                          aspectRatio: 1,
                          borderRadius: 1,
                          width: '100%',
                          backgroundColor: 'lightgrey',
                          overflow: 'hidden',
                          backgroundImage: `url(${URL.createObjectURL(_)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          position: 'relative'
                        }}
                      >
                        <IconButton
                          sx={{ position: 'absolute', right: 0, top: 0, transform: 'translate(6px,-5px)' }}
                          onClick={() => setSelectedImage(selectedImage.filter((e, i) => i !== __))}
                        >
                          <CancelIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box
                  sx={{
                    backgroundColor: 'white',
                    outline: '2px solid rgba(0,0,0,0.1)',
                    borderRadius: 2
                  }}
                >
                  <InputImageComponent onChange={handleOnChangeImage}>
                    <Button
                      sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 1, alignItems: 'center', padding: 2 }}
                      variant="raised"
                      component="span"
                    >
                      <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
                      <Typography variant="h5" sx={{ color: 'grey' }}>
                        Masukkan file desain untuk melanjutkan pesanan
                      </Typography>
                    </Button>
                  </InputImageComponent>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, paddingTop: 1 }}>
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
          )}
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              onClick={
                sectionIndex === 0 && type === 'Cart'
                  ? handleAddCart
                  : sectionIndex === 0 && type === 'Order'
                  ? handleNextSection
                  : handleAddOrder
              }
              sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}
            >
              {type === 'Cart' ? 'Masukkan Ke Keranjang' : sectionIndex === 0 ? 'Lanjutkan Pesanan' : 'Buat Pesanan'}
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
});

DialogAddOrder.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

DialogAddOrder.defaultProps = {
  open: false,
  onClose: () => {},
  data: {
    id: '',
    customerId: '',
    customerName: '',
    totalPrice: 0,
    orderInfo: [],
    currentPrice: 0
  }
};

export default DialogAddOrder;
