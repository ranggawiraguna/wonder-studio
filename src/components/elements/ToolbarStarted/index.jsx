import Logo from 'assets/images/logo/MainLogo.png';
import Component from './styled';
import { Box, Button, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';
import { BoxTransition } from '../MotionTransitions';

export default function ToolbarStarted(props) {
  return (
    <Component disableGutters>
      <Link to="/">
        <CardMedia component="img" src={Logo} />  
      </Link>
      <Box>
        {props.buttons.map((_,__) => (
          <Link key={__} to={_.link}>
            <BoxTransition variant="fadeZoom" duration={0.5}>
              <Button variant="contained" sx={ _.color ? { backgroundColor: _.color } : {}}>
                {_.text}
              </Button>
            </BoxTransition>
          </Link>
        ))}
      </Box>
    </Component>
  );
}
