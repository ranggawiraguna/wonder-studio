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
  FormControl,
  Box,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import { moneyFormatter } from 'utils/other/Services';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

const DialogUpdateOrderPrice = forwardRef(({ open, onClose, data, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentPrice(data.totalPrice);
    }
  }, [open]);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const handleUpdate = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      if (currentPrice > 0) {
        await updateDoc(doc(db, 'orders', data.id), {
          orderInfo: {
            ...data.orderInfo,
            price: currentPrice
          }
        });
        showAlertToast('success', 'Berhasil memperbarui informasi harga pesanan');
        setTimeout(() => {
          setIsUpdateProcess(false);
          handleCloseUpdate();
        }, 2000);
      } else {
        showAlertToast('warning', 'Silahkan masukkan harga pesanan dengan benar');
        setIsUpdateProcess(false);
      }
    }
  };

  const handleCloseUpdate = () => {
    if (!isUpdateProcess) {
      onClose();
      setTimeout(() => {
        setCurrentPrice(0);
      }, 500);
    }
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  return (
    <Fragment>
      <Dialog
        ref={ref}
        open={open}
        {...others}
        fullScreen={fullScreen}
        onClose={handleCloseUpdate}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Edit Harga Pesanan
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseUpdate} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            gap={1.5}
            direction="column"
            width={{ md: 500 }}
            sx={{ padding: ' 0 20px 0 10px' }}
          >
            <Box
              sx={{
                width: '80%',
                marginBottom: '20px',
                backgroundColor: '#EEEEEE',
                padding: '15px 25px',
                borderRadius: '5px',
                display: 'grid',
                gridTemplateColumns: 'auto auto 1fr',
                gridTemplateRows: 'auto',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1,
                alignSelf: 'center'
              }}
            >
              <Typography variant="h5" component="h5">
                No. Pesanan
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.id}
              </Typography>
              <Typography variant="h5" component="h5">
                Username
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.customerId}
              </Typography>
              <Typography variant="h5" component="h5">
                Nama
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.customerName}
              </Typography>
              <Typography variant="h5" component="h5">
                Total Biaya
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.totalPrice > 0 ? moneyFormatter(data.totalPrice) : '-'}
              </Typography>
            </Box>
            <FormControl
              sx={{
                width: '90%',
                fontSize: 30,
                input: { fontSize: 18, fontWeight: 'normal' },
                label: { fontSize: 16, fontWeight: 'normal' },
                span: { fontSize: 12, fontWeight: 'normal' }
              }}
              variant="outlined"
              className="input"
            >
              <InputLabel htmlFor="InputHarga">Harga Pesanan</InputLabel>
              <OutlinedInput
                id="InputHarga"
                type="number"
                value={currentPrice > 0 ? currentPrice.toString().replace(/^0+/, '') : currentPrice}
                onChange={(e) => {
                  setCurrentPrice(parseInt(e.target.value.replace(/^0+/, '')) ? parseInt(e.target.value.replace(/^0+/, '')) : 0);
                }}
                label="Harga Pesanan"
                autoComplete="off"
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleUpdate} sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}>
              Update Proses
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogUpdateOrderPrice.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

DialogUpdateOrderPrice.defaultProps = {
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

export default DialogUpdateOrderPrice;
