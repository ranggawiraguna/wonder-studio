import { Box, styled } from '@mui/material';

export default styled(Box)(({ theme }) => ({
  '& > h4': {
    color: '#666666',
    marginBottom: '5px',
    marginLeft: '2px'
  }
}));
