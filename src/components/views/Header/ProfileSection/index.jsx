import PerfectScrollbar from 'react-perfect-scrollbar';
import MainCard from 'components/views/Header/ProfileSection/MainCard';
import MaterialTransitions from 'components/elements/MaterialTransitions';
import AlertToast from 'components/elements/AlertToast';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CLEAR_SESSION, MENU_OPEN } from 'utils/redux/action';
import { useTheme } from '@mui/material/styles';
import { IconLogout, IconSettings, IconUser } from '@tabler/icons';
import { signOut } from 'firebase/auth';
import { auth } from 'config/firebase';
import {
  Avatar,
  Box,
  Chip,
  ClickAwayListener,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';

export default function ProfileSection() {
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const accountReducer = useSelector((state) => state.accountReducer);
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const anchorRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [isLogoutProcess, setIsLogoutProcess] = useState(false);
  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const handleLogout = async () => {
    if (!isLogoutProcess) {
      setIsLogoutProcess(true);

      signOut(auth)
        .then(() => {
          showAlertToast('success', 'Berhasil Logout Akun');
          setTimeout(() => {
            navigate('/masuk');
            dispatch({
              type: CLEAR_SESSION
            });
          }, 3000);
        })
        .catch((error) => {
          showAlertToast('error', error.message);
          setIsLogoutProcess(false);
        });
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, route = '') => {
    handleClose(event);

    if (route && route !== '') {
      dispatch({ type: MENU_OPEN, id: route.split('/')[route.split('/').length - 1] });
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  return (
    <>
      <Chip
        sx={{
          height: '48px',
          alignItems: 'center',
          borderRadius: '27px',
          transition: 'all .2s ease-in-out',
          borderColor: theme.palette.primary.light,
          backgroundColor: theme.palette.primary.light,
          '&[aria-controls="menu-list-grow"], &:hover': {
            borderColor: theme.palette.primary.main,
            background: `${theme.palette.primary.main}!important`,
            color: theme.palette.primary.light,
            '& svg': {
              stroke: theme.palette.primary.light
            }
          },
          '& .MuiChip-label': {
            lineHeight: 0
          }
        }}
        icon={
          <Avatar
            src={accountReducer.photoUrl}
            sx={{
              ...theme.typography.mediumAvatar,
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="1.5rem" color={theme.palette.primary.main} />}
        variant="outlined"
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="primary"
      />
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <MaterialTransitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2 }}>
                    <Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="h4">{accountReducer.fullname != null ? accountReducer.fullname : 'User'}</Typography>
                      </Stack>
                      <Typography variant="subtitle2">
                        {accountReducer.role != null
                          ? accountReducer.role[0]?.toUpperCase() + accountReducer.role?.substring(1, accountReducer.role.length)
                          : ''}
                      </Typography>
                    </Stack>
                  </Box>
                  <PerfectScrollbar style={{ height: '100%', maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <Box sx={{ p: 2 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${sidebarReducer.borderRadius}px` }}
                          selected={location.pathname.includes('profile') && !isLogoutProcess}
                          onClick={(event) => handleListItemClick(event, `/${accountReducer.role}/profile`)}
                        >
                          <ListItemIcon>
                            <IconUser stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Profile</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${sidebarReducer.borderRadius}px` }}
                          selected={isLogoutProcess}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </PerfectScrollbar>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </MaterialTransitions>
        )}
      </Popper>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </>
  );
}
