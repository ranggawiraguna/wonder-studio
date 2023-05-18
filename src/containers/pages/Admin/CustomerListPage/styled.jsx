import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  color: 'black',
  '& .row-collapse': {
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 30,
    '& > h5': {
      color: '#404040',
      textShadow: '-0.1px -0.1px 0 #404040, 0.1px -0.1px 0 #404040, -0.1px 0.1px 0 #404040, 0.1px 0.1px 0 #404040',
      letterSpacing: '0.3px',
      marginBottom: 10
    },
    '& > table': {
      '& > thead': {
        '& > tr': {
          '& > th': {
            color: '#707070',
            backgroundColor: '#EEEEEE',
            textShadow: '-0.1px -0.1px 0 #808080, 0.1px -0.1px 0 #808080, -0.1px 0.1px 0 #808080, 0.1px 0.1px 0 #808080',
            letterSpacing: '0.3px',
            border: 0,
            '&:first-of-type': {
              borderTopLeftRadius: 3,
              borderBottomLeftRadius: 3
            },
            '&:last-child': {
              borderTopRightRadius: 3,
              borderBottomRightRadius: 3
            }
          }
        }
      },
      '& > tbody': {
        '& > tr:last-child': {
          '& > td': {
            //
          }
        }
      }
    }
  }
}));
