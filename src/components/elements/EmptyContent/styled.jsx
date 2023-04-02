import { Box, styled } from '@mui/material';
import IllustrationErrorPage from 'assets/images/illustration/ErrorPageLight.svg';

export default styled(Box)(() => ({
  display: 'flex',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  position: 'absolute',
  justifyContent: 'center',
  alignItems: 'center',

  '& > div': {
    width: '80%',
    height: '60%',
    backgroundImage: `url(${IllustrationErrorPage})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'contain',
    backgroundPosition: 'center'
  }
}));
