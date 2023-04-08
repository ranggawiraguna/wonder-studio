import logo from 'assets/images/logo/MainLogo.png';
import { Link } from 'react-router-dom';
import { ButtonBase } from '@mui/material';

export default function LogoSection() {
  return (
    <ButtonBase disableRipple component={Link} to={'/'}>
      <img src={logo} alt="Wonder Studio" width="80" />
    </ButtonBase>
  );
}
