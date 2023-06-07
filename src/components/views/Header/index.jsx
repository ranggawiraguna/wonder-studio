import PropTypes from 'prop-types';
import LogoSection from '../../elements/LogoSection';
import SearchSection from './SearchSection';
import ProfileSection from './ProfileSection';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase } from '@mui/material';
import { IconMenu2 } from '@tabler/icons';
import { useLocation } from 'react-router';

const Header = ({ handleLeftDrawerToggle }) => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <>
      <Box
        sx={{
          width: 228,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Box component="span" sx={{ display: { xs: 'none', md: 'block' }, flexGrow: 1 }}>
          <LogoSection />
        </Box>
        {location.pathname.includes('guest') ? (
          <></>
        ) : (
          <ButtonBase sx={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Avatar
              variant="rounded"
              sx={{
                ...theme.typography.commonAvatar,
                ...theme.typography.mediumAvatar,
                transition: 'all .2s ease-in-out',
                background: theme.palette.secondary.light,
                color: theme.palette.secondary.dark,
                '&:hover': {
                  background: theme.palette.secondary.dark,
                  color: theme.palette.secondary.light
                }
              }}
              onClick={handleLeftDrawerToggle}
              color="inherit"
            >
              <IconMenu2 stroke={1.5} size="1.3rem" />
            </Avatar>
          </ButtonBase>
        )}
      </Box>

      <SearchSection />

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ flexGrow: 1 }} />

      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func
};

export default Header;
