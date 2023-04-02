import { styled, Toolbar } from '@mui/material';

export default styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',

  '& > div' :{
    display: 'flex',
    gap: 20,      
  },
  '& a': {
    textDecoration: 'none',
  },
  '& button': {
    fontWeight: 'bold',
    textTransform: 'none',
    letterSpacing: 'normal',
    padding: 0,
    minHeight: 0,
    minWidth: 0,
    fontFamily: 'Folks',
    transform: 'translateY(-7px)'
  },
  '& img': {
    minWidth: 'auto',
    minheight: 'auto',
    width: 'auto',
    height: 'auto'
  },

  [theme.breakpoints.only('xs')]: {
    padding: '5vw 5vw 0',

    '& button': {
      borderRadius: '1.5vw',
      fontSize: '2.5vw',
      padding: '1.2vw 3.5vw'
    },
    '& img': {
      height: '8vw'
    }
  },

  [theme.breakpoints.only('sm')]: {
    padding: '3vw 3vw 0',
    '& button': {
      borderRadius: '1vw',
      fontSize: '1.8vw',
      padding: '0.5vw 2vw'
    },
    '& img': {
      height: '6vw'
    }
  },

  [theme.breakpoints.up('md')]: {
    padding: '1vw 1.5vw 1vw 3vw',
    '& button': {
      borderRadius: '0.4vw',
      fontSize: '0.9vw',
      padding: '0.3vw 1.2vw'
    },
    '& img': {
      height: '3vw'
    }
  }
}));
