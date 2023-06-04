import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  display: 'grid',
  columnGap: 20,
  '& > div:first-of-type': {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#EEEEEE',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  },
  '& > div:nth-of-type(2), & > div:nth-of-type(3)': {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    '& > p': {
      marginRight: 5
    },
    '& > div': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 1000,
      width: 20,
      height: 20,
      '& > p': {
        fontSize: 9,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        transform: 'translateY(1px)'
      }
    }
  },
  '& > p:nth-of-type(1)': {
    color: '#404040',
    fontWeight: 'bold'
  },
  '& > p:last-child': {
    marginRight: 20,
    textAlign: 'end',
    color: '#404040',
    fontWeight: 'bold'
  },

  [theme.breakpoints.only('xs')]: {
    '& > p:last-child': {
      marginRight: 0
    }
  }
}));
