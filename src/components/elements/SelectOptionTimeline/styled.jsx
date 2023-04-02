import { InputBase, styled } from '@mui/material';

export default styled(InputBase)(() => ({
  marginRight: '5px',
  paddingRight: '3px',
  '& .MuiInputBase-input': {
    transform: 'translateX(6px)',
    backgroundColor: 'white',
    fontSize: 14,
    outline: '2px solid #ced4da',
    border: '2px solid white',
    borderRadius: 4,
    padding: '5px 15px 5px 10px',
    '&:focus': {
      border: '2px solid white',
      borderRadius: 4
    }
  }
}));
