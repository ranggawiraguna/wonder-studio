import MaterialTransitions from 'components/elements/MaterialTransitions';
import PopupState, { bindPopper, bindToggle } from 'material-ui-popup-state';
// import { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Avatar, Box, ButtonBase, Card, Grid, InputAdornment } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import { PopperStyle, OutlineInputStyle, HeaderAvatarStyle } from './styled';
import { useDispatch, useSelector } from 'react-redux';
import { SET_VALUE } from 'utils/redux/action';

export default function SearchSection() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const searchReducer = useSelector((state) => state.searchReducer);

  return (
    <>
      <Box sx={{ display: { xs: 'block', md: 'none' } }}>
        <PopupState variant="popper" popupId="demo-popup-popper">
          {(popupState) => (
            <>
              <Box sx={{ ml: 2 }}>
                <ButtonBase sx={{ borderRadius: '12px' }}>
                  <HeaderAvatarStyle variant="rounded" {...bindToggle(popupState)}>
                    <IconSearch stroke={1.5} size="1.2rem" />
                  </HeaderAvatarStyle>
                </ButtonBase>
              </Box>
              <PopperStyle {...bindPopper(popupState)} transition>
                {({ TransitionProps }) => (
                  <>
                    <MaterialTransitions type="zoom" {...TransitionProps} sx={{ transformOrigin: 'center left' }}>
                      <Card
                        sx={{
                          background: '#fff',
                          [theme.breakpoints.down('sm')]: {
                            border: 0,
                            boxShadow: 'none'
                          }
                        }}
                      >
                        <Box sx={{ p: 2 }}>
                          <Grid container alignItems="center" justifyContent="space-between">
                            <Grid item xs>
                              <OutlineInputStyle
                                disabled={!searchReducer.isActive}
                                id="input-search-header"
                                value={searchReducer.value}
                                onChange={(e) => dispatch({ type: SET_VALUE, value: e.target.value })}
                                sx={{
                                  borderRadius: '12px'
                                }}
                                placeholder="Pencarian"
                                startAdornment={
                                  <InputAdornment position="start">
                                    <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
                                  </InputAdornment>
                                }
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Box sx={{ ml: 2 }}>
                                      <ButtonBase sx={{ borderRadius: '12px' }}>
                                        <Avatar
                                          variant="rounded"
                                          sx={{
                                            ...theme.typography.commonAvatar,
                                            ...theme.typography.mediumAvatar,
                                            background: theme.palette.orange.light,
                                            color: theme.palette.orange.dark,
                                            '&:hover': {
                                              background: theme.palette.orange.dark,
                                              color: theme.palette.orange.light
                                            }
                                          }}
                                          {...bindToggle(popupState)}
                                        >
                                          <IconX stroke={1.5} size="1.3rem" />
                                        </Avatar>
                                      </ButtonBase>
                                    </Box>
                                  </InputAdornment>
                                }
                                aria-describedby="search-helper-text"
                                inputProps={{ 'aria-label': 'weight' }}
                              />
                            </Grid>
                          </Grid>
                        </Box>
                      </Card>
                    </MaterialTransitions>
                  </>
                )}
              </PopperStyle>
            </>
          )}
        </PopupState>
      </Box>
      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <OutlineInputStyle
          disabled={!searchReducer.isActive}
          id="input-search-header"
          value={searchReducer.value}
          sx={{
            borderRadius: '12px'
          }}
          onChange={(e) => dispatch({ type: SET_VALUE, value: e.target.value })}
          placeholder="Pencarian"
          endAdornment={
            <InputAdornment position="start">
              <IconSearch stroke={1.5} size="1rem" color={theme.palette.grey[500]} />
            </InputAdornment>
          }
          aria-describedby="search-helper-text"
          inputProps={{ 'aria-label': 'weight' }}
        />
      </Box>
    </>
  );
}
