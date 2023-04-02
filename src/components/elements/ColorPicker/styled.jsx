import { DialogContent, styled } from '@mui/material';

export default styled(DialogContent)(() => ({
  '& > div': {
    '& .react-colorful': {
      height: '35vh',
      width: '100%'
    },
    '& .react-colorful__saturation-pointer': {
      width: 15,
      height: 15,
      borderRadius: 100
    },
    '& > div:last-of-type': {
      width: '100%',
      height: 30,
      borderRadius: 5
    }
  }
}));
