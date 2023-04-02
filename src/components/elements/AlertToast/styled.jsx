import { Snackbar, styled } from '@mui/material';

export default styled(Snackbar)(() => ({
  maxWidth: '80vw',
  position: 'fixed',
  left: '50%',
  transform: 'translate(-50%, -50%)'
}));
