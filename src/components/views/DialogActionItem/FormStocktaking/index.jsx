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
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import { Box } from '@mui/system';
import { collection, deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

const DialogFormStocktaking = forwardRef(({ open, onClose, item, status, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (open && (item === null || status === '')) {
      onClose();
    }
  }, [open, item, status]);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const handleUpdate = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      const outOfRange = status === 'outbound' ? amount > item.amount : false;
      const wrongAmount = amount <= 0;

      if (!wrongAmount && !outOfRange) {
        const docRef = doc(collection(db, 'stocktakings'));
        const currentDate = new Date();

        setDoc(docRef, {
          itemId: item.id,
          amount: amount,
          prevAmount: item.amount,
          nextAmount: status === 'inbound' ? item.amount + amount : item.amount - amount,
          type: status,
          dateCreated: currentDate
        })
          .catch(() => {
            showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
            setIsUpdateProcess(false);
          })
          .then(() => {
            updateDoc(doc(db, 'items', item.id), {
              amount: status === 'inbound' ? item.amount + amount : item.amount - amount,
              stocktakingHistory: [
                ...item.stocktakingHistory,
                {
                  date: currentDate,
                  id: docRef.id
                }
              ]
            })
              .catch(() => {
                deleteDoc(docRef);
                showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
                setIsUpdateProcess(false);
              })
              .then(() => {
                showAlertToast('success', `Berhasil menambahkan ${status === 'inbound' ? 'pemasukan' : 'pengeluaran'} barang`);
                setTimeout(() => {
                  setIsUpdateProcess(false);
                  handleCloseUpdate();
                }, 2000);
              });
          });
      } else if (outOfRange) {
        showAlertToast('warning', 'Silahkan masukkan jumlah pengeluaran sesuai dengan jumlah stok yang ada');
        setIsUpdateProcess(false);
      } else if (wrongAmount) {
        showAlertToast('warning', `Silahkan periksa jumlah ${status === 'inbound' ? 'pemasukan' : 'pengeluaran'} dengan benar`);
        setIsUpdateProcess(false);
      }
    }
  };

  const handleCloseUpdate = () => {
    if (!isUpdateProcess) {
      onClose();
      setTimeout(() => {
        setAmount(0);
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

  return item && status ? (
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
              Input {status !== '' ? (status === 'inbound' ? 'Pemasukan' : 'Pengeluaran') : ''}
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseUpdate} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" justifyContent="center" gap={3} direction="column" minWidth={{ md: 450 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  backgroundColor: 'lightgrey',
                  backgroundImage: `url(${item.images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  borderRadius: '5px'
                }}
              />
              <br />
              <Typography variant="h5" component="h5">
                {item.name}
              </Typography>
              <Typography variant="p" component="p">
                ID : {item.id}
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
              <InputLabel htmlFor="InputJumlah">Jumlah</InputLabel>
              <OutlinedInput
                id="InputJumlah"
                type="number"
                value={amount > 0 ? amount.toString().replace(/^0+/, '') : 0}
                onChange={(e) => {
                  let value = e.target.value;
                  value = parseInt(value.replace(/^0+/, '')) ? parseInt(value.replace(/^0+/, '')) : 0;
                  value = value > 0 ? value : 0;

                  setAmount(value);
                }}
                label="Jumlah"
                autoComplete="off"
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleUpdate} sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}>
              Tambahkan Data
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  ) : (
    <></>
  );
});

DialogFormStocktaking.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

DialogFormStocktaking.defaultProps = {
  open: false,
  onClose: () => {},
  data: {
    username: '',
    fullname: '',
    photoUrl: ''
  }
};

export default DialogFormStocktaking;
