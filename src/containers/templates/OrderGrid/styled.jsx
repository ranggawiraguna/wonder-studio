import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  display: 'grid',
  alignItems: 'stretch',
  gap: 20,
  gridTemplateRows: 'auto',

  '& > div': {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    boxShadow: '0 2px 10px 2px rgba(0,0,0,0.1)',
    '& > div': {
      display: 'grid',
      gridTemplateRows: 'auto',
      alignItems: 'center',
      marginBottom: 20,
      width: '100%',

      '&:nth-of-type(1)': {
        '& > p': {
          textAlign: 'end'
        }
      },
      '&:nth-of-type(3)': {
        display: 'flex',
        justifyContent: 'center',
        gap: 4,
        '& > div': {
          width: 8,
          height: 8,
          borderRadius: 1000,
          backgroundColor: 'lightgrey'
        }
      },
      '&:nth-of-type(4)': {
        gap: 10,
        '& > p:last-child': {
          color: '#FF583C',
          fontWeight: 'bold'
        }
      },
      '&:nth-of-type(5)': {
        gap: 10,
        '& img': {
          width: 25,
          height: 25
        },
        '& p': {
          transform: 'translateY(1px)'
        }
      },
      '&:nth-of-type(6)': {
        marginBottom: 0,
        gap: 20,
        '& button': {
          fontWeight: 'bold',
          textTransform: 'none',
          backgroundColor: '#FF583C',
          letterSpacing: 'normal',
          padding: '5px 15px 3px',
          minHeight: 0,
          minWidth: 0
        }
      }
    },

    '& > hr': {
      height: 1.5,
      borderRadius: 1000,
      marginBottom: 20,
      opacity: '0.3'
    }
  },

  //=======================================================================================================

  //Mobile Breakpoint =====================================================================================
  [theme.breakpoints.only('xs')]: {
    gridTemplateColumns: 'repeat(1,1fr)',

    '& > div': {
      '& > div': {
        '&:nth-of-type(2)': {
          '& > p:last-child': {
            marginRight: 0
          }
        }
      }
    }
  },
  //=======================================================================================================

  //Tablet Breakpoint =====================================================================================
  [theme.breakpoints.only('sm')]: {
    gridTemplateColumns: 'repeat(1,1fr)'
  },
  //=======================================================================================================

  //Laptop Breakpoint =====================================================================================
  [theme.breakpoints.only('md')]: {
    gridTemplateColumns: 'repeat(2,1fr)'
  },
  //=======================================================================================================

  //Desktop Breakpoint =====================================================================================
  [theme.breakpoints.up('lg')]: {
    gridTemplateColumns: 'repeat(2,1fr)'
  }
  //=======================================================================================================
}));
