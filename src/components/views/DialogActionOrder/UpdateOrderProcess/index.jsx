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
  Select,
  MenuItem,
  InputBase
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { orderProcess, orderProcessDetail } from 'utils/other/EnvironmentValues';
import { moneyFormatter } from 'utils/other/Services';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

const DialogUpdateOrderProcess = forwardRef(({ open, onClose, data, showAlert, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [customer, setCustomer] = useState({});
  const [currentProcess, setCurrentProcess] = useState('');

  useEffect(() => {
    if (open) {
      setCurrentProcess('');
    }
  }, [open]);

  const getProcessOptions = () => {
    if (data.processTracking.length > 0) {
      return Object.keys(orderProcess)
        .filter(
          (process) =>
            process !== orderProcess.waitingPayment &&
            Object.keys(orderProcess).findIndex((name) => name === process) >
              Object.keys(orderProcess).findIndex((name) => name === data.processTracking[data.processTracking.length - 1].name)
        )
        .filter((_) =>
          data.deliveryType === 'cod' ? ![orderProcess.orderProcess].includes(_) : ![orderProcess.orderReadyPickup].includes(_)
        );
    } else {
      return [];
    }
  };

  const handleUpdate = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      if (currentProcess !== '') {
        if (currentProcess !== orderProcess.orderCanceled ? (data.deliveryType === 'cod' ? true : data.shippingPrice) : true) {
          let newData = {
            processTracking: [
              ...data.processTracking,
              {
                date: new Date(),
                name: currentProcess
              }
            ]
          };

          if (currentProcess === orderProcess.paymentConfirmed) {
            newData = {
              ...newData,
              transactionInfo: {
                ...data.transactionInfo,
                status: true
              }
            };
          }

          if (currentProcess === orderProcess.orderFinished) {
            newData = {
              ...newData,
              dateFinished: new Date(),
              sold: (data.sold ?? 0) + 1
            };
          }

          await updateDoc(doc(db, 'orders', data.id), newData);
          setCurrentProcess('');
          showAlert('success', 'Berhasil memperbarui informasi proses pesanan');
          setTimeout(() => {
            setIsUpdateProcess(false);
            handleCloseUpdate();
          }, 2000);
        } else {
          showAlert('warning', 'Silahkan input biaya pengiriman pada pesanan detail terlebih dahulu');
          setIsUpdateProcess(false);
        }
      } else {
        showAlert('warning', 'Silahkan pilih proses untuk memperbarui proses pesanan');
        setIsUpdateProcess(false);
      }
    }
  };

  const handleCloseUpdate = () => {
    if (!isUpdateProcess) {
      onClose();
      setTimeout(() => {
        setCurrentProcess('');
      }, 500);
    }
  };

  useEffect(() => {
    if (data.customerId) {
      const listenerCustomer = onSnapshot(doc(db, 'customers', data.customerId), (snapshot) => {
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
        listenerCustomer();
      };
    }
  }, [data.customerId]);

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
              Edit Proses Pesanan
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseUpdate} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container justifyContent="center" gap={1.5} direction="column" width={{ md: 500 }} sx={{ padding: ' 0 20px 0 10px' }}>
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
                {customer?.username}
              </Typography>
              <Typography variant="h5" component="h5">
                Nama
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.name}
              </Typography>
              <Typography variant="h5" component="h5">
                Total Biaya
              </Typography>
              <Typography variant="h5" component="h5">
                :
              </Typography>
              <Typography variant="h5" component="h5">
                {data.products ? moneyFormatter(data.products.reduce((a, b) => a + b.price, 0) + (data.shippingPrice ?? 0)) : 'Rp. -'}
              </Typography>
            </Box>
            <Typography variant="h4" component="h4" sx={{ color: '#404040' }}>
              Proses Terbaru
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Box sx={{ width: '12px', height: '12px', borderRadius: 1000, backgroundColor: '#C4C4C4' }} />
              <Typography
                variant="p"
                component="p"
                sx={{ flex: 1, color: '#404040', padding: '10px 10px', border: '3px solid rgba(136,136,136, 0.25)', borderRadius: '5px' }}
              >
                {data.processTracking.length > 0
                  ? orderProcessDetail[data.processTracking[data.processTracking.length - 1].name].title
                  : ''}
              </Typography>
            </Box>
            <Typography variant="h4" component="h4" sx={{ color: '#404040' }}>
              Proses Input
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Box sx={{ width: '12px', height: '12px', borderRadius: 1000, backgroundColor: '#C4C4C4' }} />
              <FormControl sx={{ flex: 1 }}>
                <Select
                  displayEmpty
                  disabled={!(data.processTracking.length > 0 && getProcessOptions().length > 0)}
                  value={data.processTracking.map((e) => e.name).includes(currentProcess) ? '' : currentProcess}
                  onChange={(e) => setCurrentProcess(e.target.value)}
                  input={<InputBase sx={{ padding: '4px 10px', border: '3px solid rgba(136,136,136, 0.25)', borderRadius: '5px' }} />}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 48 * 4.5 + 8,
                        width: 250
                      }
                    }
                  }}
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem disabled value="" sx={{ display: 'none' }}>
                    <em>{!(data.processTracking.length > 0 && getProcessOptions().length > 0) ? '' : 'Pilih proses pesanan terbaru'}</em>
                  </MenuItem>
                  {data.processTracking.length > 0 && getProcessOptions().length > 0
                    ? getProcessOptions().map((name, index) =>
                        !data.processTracking.map((e) => e.name).includes(name) ? (
                          <MenuItem key={index} value={name} sx={{ whiteSpace: 'pre-wrap' }}>
                            {orderProcessDetail[name].title}
                          </MenuItem>
                        ) : null
                      )
                    : null}
                </Select>
              </FormControl>
            </Box>
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
    </Fragment>
  );
});

DialogUpdateOrderProcess.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

DialogUpdateOrderProcess.defaultProps = {
  open: false,
  onClose: () => {},
  data: {
    id: '',
    customerId: '',
    customerName: '',
    totalPrice: 0,
    processTracking: [],
    currentProcess: ''
  }
};

export default DialogUpdateOrderProcess;
