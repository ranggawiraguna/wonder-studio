import React, { forwardRef, useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import { FormControl, Input, InputLabel } from '@mui/material';
import { orderProcess } from 'utils/other/EnvironmentValues';

const DialogUpdateDeliveryPrice = forwardRef(({ open, onClose, showAlert, data }, ref) => {
  const [price, setPrice] = useState(0);

  const handleClose = () => {
    onClose();
    setPrice(0);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle sx={{ fontSize: 16, fontWeight: 'bold' }}>Biaya Pengiriman</DialogTitle>
      <DialogContent>
        <DialogContentText>Masukkan biaya pengiriman untuk melanjutkan pesanan</DialogContentText>
        <FormControl
          autoFocus
          fullWidth
          variant="standard"
          margin="dense"
          className="input"
          sx={{
            '& input[type=number]': {
              '-moz-appearance': 'textfield'
            },
            '& input[type=number]::-webkit-outer-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            },
            '& input[type=number]::-webkit-inner-spin-button': {
              '-webkit-appearance': 'none',
              margin: 0
            }
          }}
        >
          <InputLabel htmlFor="InputHarga">Harga</InputLabel>
          <Input
            id="InputHarga"
            type="number"
            value={(parseInt(price) || 0) > 0 ? price.toString().replace(/^0+/, '') : ''}
            onChange={(_) => setPrice(parseInt(_.target.value.replace(/^0+/, '')))}
            label="Harga"
            autoComplete="off"
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            updateDoc(doc(db, 'orders', data.id), {
              processTracking: [
                ...(data.processTracking ?? []),
                {
                  name: orderProcess.waitingPayment,
                  date: new Date()
                }
              ],
              shippingPrice : price
            })
              .catch((_) => {
                showAlert('error', 'Terjadi kesalahan, silahka coba lagi');
              })
              .then(() => {
                showAlert('success', 'Berhasil memperbarui biaya pengiriman pesanan');
                handleClose();
              });
          }}
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default DialogUpdateDeliveryPrice;
