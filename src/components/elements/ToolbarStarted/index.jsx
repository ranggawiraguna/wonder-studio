import Logo from 'assets/images/logo/MainLogo.png';
import Component from './styled';
import { Box, Button, CardMedia, Divider, Drawer, List, ListItem, ListItemButton, Typography, useMediaQuery } from '@mui/material';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { BoxTransition } from '../MotionTransitions';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import Hamburger from 'hamburger-react';

export default function ToolbarStarted(props) {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const isDownMd = useMediaQuery(useTheme().breakpoints.down('md'));
  const [isOpen, setOpen] = useState(false);

  return (
    <Box sx={{ position: 'relative' }}>
      <Component disableGutters>
        <Link to="/">
          <CardMedia component="img" src={Logo} />
        </Link>
        {!isDownMd ? (
          <>
            <Box sx={{ flex: 1 }}>
              <Link to="/profile">
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: location.pathname === '/profile' ? 'black' : 'grey',
                    marginRight: 2,
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  Profile
                </Typography>
              </Link>
              <Link to="/service">
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: location.pathname === '/service' ? 'black' : 'grey',
                    marginRight: 2,
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  Layanan
                </Typography>
              </Link>
              <Link to="/product">
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: location.pathname === '/product' || location.pathname === `/product/${params.id}` ? 'black' : 'grey',
                    marginRight: 2,
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  Produk
                </Typography>
              </Link>
              <Link to="/contact">
                <Typography
                  sx={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: location.pathname === '/contact' ? 'black' : 'grey',
                    marginRight: 2,
                    '&:hover': {
                      color: 'black'
                    }
                  }}
                >
                  Contact
                </Typography>
              </Link>
            </Box>
            <Box>
              {props.buttons.map((_, __) => (
                <Link key={__} to={_.link}>
                  <BoxTransition variant="fadeZoom" duration={0.5}>
                    <Button variant="contained" sx={_.color ? { backgroundColor: _.color } : {}}>
                      {_.text}
                    </Button>
                  </BoxTransition>
                </Link>
              ))}
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ flex: 1 }} />
            <Hamburger toggled={isOpen} toggle={setOpen} />
          </>
        )}
      </Component>
      <Drawer anchor="top" open={isOpen} onClose={() => setOpen(false)} sx={{ position: 'absolute', zIndex: 100 }}>
        <Box sx={{ width: 'auto', height: '100vh', paddingTop: 10 }} role="presentation" onKeyDown={() => setOpen(false)}>
          <Divider />
          <List>
            {[
              { name: 'Login', path: '/masuk' },
              { name: 'Daftar', path: '/daftar' }
            ].map((text) => (
              <>
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    onClick={() => {
                      setOpen(false);
                      navigate(text.path);
                    }}
                  >
                    <Typography variant="h5" sx={{ textAlign: 'center', fontSize: 18 }}>
                      {text.name}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
          <br />
          <Divider />
          <List>
            {[
              { name: 'Profile', path: '/profile' },
              { name: 'Produk', path: '/product' },
              { name: 'Layanan', path: '/service' },
              { name: 'Kontak', path: '/contact' }
            ].map((text) => (
              <>
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    sx={{ display: 'flex', justifyContent: 'center' }}
                    onClick={() => {
                      setOpen(false);
                      navigate(text.path);
                    }}
                  >
                    <Typography variant="h5" sx={{ textAlign: 'center', fontSize: 18 }}>
                      {text.name}
                    </Typography>
                  </ListItemButton>
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
}
