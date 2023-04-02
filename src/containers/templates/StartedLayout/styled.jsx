import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  backgroundColor: '#b0ecfb',
  width: '100vw',
  height: '100vh',
  position: 'relative',
  overflow: 'hidden',

  '& > *': {
    margin: '0 auto'
  },

  [theme.breakpoints.only('xs')]: {
    padding: 0
  },

  [theme.breakpoints.only('sm')]: {
    padding: 0
  },

  [theme.breakpoints.up('md')]: {
    padding: '5vw 5vw 0 5vw'
  }
}));
