import { useTheme } from '@emotion/react';
import { Box, Button, Dialog, DialogActions, DialogTitle, Grid, IconButton, Typography, useMediaQuery } from '@mui/material';
import { forwardRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from './styled';

const ColorPicker = forwardRef(({ open, onClose, onConfirmed, ...others }, reference) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [color, setColor] = useState('#ffffff');

  return (
    <Dialog ref={reference} open={open} {...others} fullScreen={fullScreen} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle>
        <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
          <Typography variant="h3" component="h3">
            Pilih Warna
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box minWidth="350px">
          <HexColorPicker color={color} onChange={setColor} />
          <br />
          <Box sx={{ backgroundColor: color }} />
        </Box>
      </DialogContent>
      <DialogActions>
        <Grid container justifyContent="center">
          <Button
            variant="contained"
            onClick={() => {
              onConfirmed(color);
              onClose();
            }}
            sx={{ fontSize: 16, fontWeight: 'bold', marginBottom: 2 }}
          >
            Terapkan Pilihan
          </Button>
        </Grid>
      </DialogActions>
    </Dialog>
  );
});

export default ColorPicker;
