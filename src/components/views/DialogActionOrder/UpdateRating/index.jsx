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
  Rating
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { Fragment, forwardRef, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import OrderItem from 'components/elements/OrderItem';
import AlertToast from 'components/elements/AlertToast';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

const DialogUpdateRating = forwardRef(({ open, onClose, data, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [productRating, setProductRating] = useState([]);
  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  useEffect(() => {
    setProductRating([open ? data.products.map((_) => 0) : []]);
  }, [open]);

  const handleClose = () => {
    onClose();
    setIsUpdateProcess(false);
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
      <Dialog ref={ref} open={open} {...others} fullScreen={fullScreen} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Penilaian Produk
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 400 }}>
            {data.products.length > 0 ? (
              data.products.map((product, index) => (
                <>
                  <OrderItem data={product} />
                  <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', paddingRight: 2 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      Penilaian :
                    </Typography>
                    <Box sx={{ flex: 1 }} />
                    <Rating
                      value={productRating[index]}
                      onChange={(_, value) => setProductRating([...productRating.map((_, __) => (__ === index ? value : _))])}
                    />
                  </Box>
                </>
              ))
            ) : (
              <Box sx={{ width: 200, height: 100 }} />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              onClick={() => {
                if (!isUpdateProcess) {
                  if (productRating.every((_) => _ > 0)) {
                    setIsUpdateProcess(true);
                    data.products.forEach(async (_, __) => {
                      updateDoc(doc(db, 'products', _.productId), {
                        rating: [
                          ...((await getDoc(doc(db, 'products', _.productId))).data().rating ?? []),
                          {
                            orderId: data.id,
                            rateValue: productRating[__] ?? 0
                          }
                        ]
                      });
                      updateDoc(doc(db, 'orders', data.id), {
                        haveRated: true
                      });
                      handleClose();
                    });
                  } else {
                    showAlertToast('warning', 'Silahkan berikan penilaian untuk semua produk yang kamu pesan');
                  }
                }
              }}
              sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}
            >
              Berikan Penilaian
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogUpdateRating.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

DialogUpdateRating.defaultProps = {
  open: false,
  onClose: () => {}
};

export default DialogUpdateRating;
