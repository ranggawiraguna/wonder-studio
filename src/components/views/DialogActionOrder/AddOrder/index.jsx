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
  InputLabel
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CancelIcon from '@mui/icons-material/Cancel';
import { defaultProductImage } from 'utils/other/EnvironmentValues';

const InputImageComponent = (props) => (
  <>
    <input hidden id="file-attachment" accept="image/*" type="file" multiple onChange={props.onChange} />
    <label htmlFor="file-attachment">{props.children}</label>
  </>
);

const DialogAddOrder = forwardRef(({ open, onClose, type, data, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isAddOrderProcess, setAddOrderProcess] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [orderForm, setOrderForm] = useState({
    name: '',
    phoneNumber: '',
    address: ''
  });

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
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
      showAlertToast('warning', 'Silahkan masukkan gambar desain untuk melanjutkan');
    }
  };

  const handleAddCart = async () => {
    if (!isAddOrderProcess) {
      if (selectedImage.length > 0) {
        showAlertToast('success', 'Berhasil menambahkan pesanan');
        setAddOrderProcess(true);
        setTimeout(() => {
          handleCloseDialog();
        }, 3000);
      } else {
        showAlertToast('warning', 'Silahkan masukkan gambar desain untuk melanjutkan');
      }
    }
  };

  const handleAddOrder = async () => {
    if (!isAddOrderProcess) {
      if (Object.keys(orderForm).every((_) => Boolean(orderForm[_]))) {
        showAlertToast('success', 'Berhasil menambahkan pesanan');
        setAddOrderProcess(true);
        setTimeout(() => {
          handleCloseDialog();
        }, 3000);
      } else {
        showAlertToast('warning', 'Silahkan lengkapi formulir pesanan dengan benar');
      }
    }
  };

  const handleCloseDialog = () => {
    if (!isAddOrderProcess) {
      onClose();
      selectedImage.forEach((_) => URL.revokeObjectURL(_));
      setAddOrderProcess(false);
      setSelectedImage([]);
      setOrderForm({
        name: '',
        phoneNumber: '',
        address: ''
      });
      setSectionIndex(0);
    }
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const currentPrice =
    data.product.price ??
    (data.product.sizeSelected != null && data.product.modelSelected != null
      ? data.product.prices.find((_) => _.fields.contains(data.sizeSelected) && _.fields.contains(data.modelSelected)).value
      : data.product.prices.find((_) => _.fields.contains(data.sizeSelected || data.modelSelected))
    ).value;

  return (
    <Fragment>
      <Dialog
        fullWidth
        ref={ref}
        open={open}
        {...others}
        fullScreen={fullScreen}
        onClose={handleCloseDialog}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Formulir Pesanan
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseDialog} aria-label="close">
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
                          (data.sizeSelected != null ? `${data.sizeSelected}, ` : '') +
                          (data.countCart != null ? `${data.countCart} ${stringCapitalize(data.product.uom)}` : '')}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'grey' }}>
                        {moneyFormatter(currentPrice)} / {stringCapitalize(data.product.uom)}
                      </Typography>
                    </Box>
                    <Typography variant="h4" sx={{ marginBottom: 0.5, textAlign: 'end', paddingRight: 2, color: 'grey' }}>
                      {moneyFormatter(currentPrice * data.countCart)}
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
              <FormControl variant="outlined" className="input">
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
              <FormControl variant="outlined" className="input">
                <InputLabel htmlFor="InputAddress">Alamat Lengkap</InputLabel>
                <OutlinedInput
                  id="InputAddress"
                  type="text"
                  multiline
                  minRows={5}
                  value={orderForm.address}
                  onChange={handleOnChangeForm('address')}
                  label="Alamat Lengkap"
                  placeholder="Masukkan Alamat Lengkap"
                  autoComplete="off"
                />
              </FormControl>
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
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
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
    currentPrice: ''
  }
};

export default DialogAddOrder;
