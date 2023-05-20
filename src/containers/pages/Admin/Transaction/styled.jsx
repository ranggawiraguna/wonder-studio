import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  '& .data-status': {
    minWidth: 0,
    minHeight: 0,
    height: 25,
    width: 'auto',
    margin: '0 auto'
  }
}));
