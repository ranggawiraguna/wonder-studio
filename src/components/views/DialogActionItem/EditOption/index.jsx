/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogTitle, DialogContent, IconButton, Grid, Typography, CardMedia, Box, Button } from '@mui/material';
import { forwardRef, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CardItemEditInbound from 'assets/images/icon/CardItemEditInbound.svg';
import CardItemEditOutbound from 'assets/images/icon/CardItemEditOutbound.svg';
import CardItemEditInfo from 'assets/images/icon/CardItemEditInfo.svg';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';

const DialogEditOption = forwardRef(({ open, onClose, onConfirmed, item, ...others }, reference) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (open && item === null) {
      onClose();
    }
  }, [open, item]);

  return item ? (
    <Dialog ref={reference} open={open} {...others} onClose={onClose} aria-labelledby="responsive-dialog-title">
      <DialogTitle>
        <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
          <Typography variant="h3" component="h3">
            Pilih Jenis Edit
          </Typography>
          <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Grid>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: '500px'
          }}
        >
          <Button sx={{ padding: 0, minWidth: 0, minHeight: 0 }} onClick={() => navigate(`/admin/item/edit/${item.id}`)}>
            <CardMedia component="img" src={CardItemEditInfo} />
          </Button>
          <Button sx={{ padding: 0, minWidth: 0, minHeight: 0 }} onClick={() => onConfirmed(item, 'inbound')}>
            <CardMedia component="img" src={CardItemEditInbound} />
          </Button>
          <Button sx={{ padding: 0, minWidth: 0, minHeight: 0 }} onClick={() => onConfirmed(item, 'outbound')}>
            <CardMedia component="img" src={CardItemEditOutbound} />
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  ) : (
    <></>
  );
});

DialogEditOption.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

DialogEditOption.defaultProps = {
  open: false,
  onClose: () => {}
};

export default DialogEditOption;
