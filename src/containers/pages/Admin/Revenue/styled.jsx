import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  '& .table-container': {
    '& > table': {
      '& > thead': {
        '& th': {
          backgroundColor: '#EFEFEF',
          color: 'black',
          fontWeight: 'bold',
          fontSize: 14,
          borderBottom: 0,
          '&:first-of-type': {
            borderTopLeftRadius: 3,
            borderBottomLeftRadius: 3
          },
          '&:last-child': {
            borderTopRightRadius: 3,
            borderBottomRightRadius: 3
          }
        }
      },
      '& > tbody': {
        '& td': {
          color: 'black'
        }
      }
    }
  }
}));
