import { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function DialogSingleForm({ open, onClose, onConfirmed, title, label, type }) {
  const [value, setValue] = useState('');

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setValue('');
      }}
    >
      <DialogTitle sx={{ fontSize: 16 }}>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={label}
          type={type}
          fullWidth
          onChange={(e) => setValue(e.target.value)}
          variant="standard"
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              onClose();
              onConfirmed(value);
              setValue('');
              ev.preventDefault();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            onConfirmed(value);
            setValue('');
          }}
        >
          Tambahkan
        </Button>
      </DialogActions>
    </Dialog>
  );
}
