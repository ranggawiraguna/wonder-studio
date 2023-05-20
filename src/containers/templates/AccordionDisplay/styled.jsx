import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  //Normal Breakpoint =====================================================================================
  width: '100%',
  display: 'grid',
  alignItems: 'center',
  gap: 20,
  gridTemplateRows: 'auto',
  gridTemplateColumns: '1fr auto',

  '& > div': {
    '& > .accordion': {
      overflow: 'hidden',
      borderBottom: 'white solid 1px',

      '&:first-of-type': {
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
      },

      '&:last-child': {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
      },

      '& > .accordion-header': {
        backgroundColor: '#404040',
        '& h4': {
          color: 'white'
        },
        '& svg': {
          fill: 'white'
        }
      },

      '& .accordion-body': {
        padding: '20px 30px'
      }
    }
  },

  //=======================================================================================================
  //Mobile Breakpoint =====================================================================================
  [theme.breakpoints.only('xs')]: {
    colors: 'black'
  },
  //=======================================================================================================
  //Tablet Breakpoint =====================================================================================
  [theme.breakpoints.between('sm', 'lg')]: {
    colors: 'black'
  },
  //=======================================================================================================
  //Laptop+ Breakpoint =====================================================================================
  [theme.breakpoints.up('lg')]: {
    colors: 'black'
  }
  //=======================================================================================================
}));
