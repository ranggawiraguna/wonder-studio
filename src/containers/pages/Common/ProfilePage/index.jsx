import { Avatar, Button, Grid, Typography } from '@mui/material';
import { Box } from '@mui/system';
import DialogChangePassword from 'components/views/DialogActionProfile/ChangePassword';
import DialogUpdateProfile from 'components/views/DialogActionProfile/UpdateProfile';
import { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import PageRoot from './styled';

export default function ProfilePage() {
  const accountReducer = useSelector((state) => state.accountReducer);

  const [openDialogUpdateProfile, setOpenDialogUpdateProfile] = useState(false);
  const [openDialogChangePassword, setOpenDialogChangePassword] = useState(false);

  return (
    <Fragment>
      <PageRoot>
        <Typography className="detail-title" variant="h2" component="h2">
          Profil Admin
        </Typography>
        <Grid className="detail-info" container alignItems="center" justifyContent="center" rowGap={{ md: 7 }}>
          <Grid container item xs={12} md={4} alignItems="center" justifyContent="center">
            <Avatar
              sx={{ width: { xs: 230, sm: 250, md: 220 }, height: { xs: 230, sm: 250, md: 220 } }}
              alt={accountReducer.name}
              src={accountReducer.photoUrl}
            />
          </Grid>
          <Grid container item direction="column" xs={12} md={8} gap={{ xs: 3, sm: 5 }} marginTop={{ xs: 5, sm: 7, md: 0 }}>
            <Box className="group-field">
              <Typography variant="h4" component="h4">
                Username
              </Typography>
              <Box>
                <Typography variant="p" component="p">
                  {accountReducer.username}
                </Typography>
              </Box>
            </Box>
            <Box className="group-field">
              <Typography variant="h4" component="h4">
                Email
              </Typography>
              <Box>
                <Typography variant="p" component="p">
                  {accountReducer.email}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} marginTop={{ xs: 3, sm: 5, md: 0 }}>
            <Box className="group-field">
              <Typography variant="h4" component="h4">
                Nama Lengkap
              </Typography>
              <Box>
                <Typography variant="p" component="p">
                  {accountReducer.fullname}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid container item xs={12} gap={3} justifyContent={{ xs: 'center', sm: 'flex-end' }} marginTop={{ xs: 4, md: 0 }}>
            <Button variant="contained" onClick={() => setOpenDialogUpdateProfile(true)}>
              Update Profil
            </Button>
            <Button variant="contained" onClick={() => setOpenDialogChangePassword(true)}>
              Ubah Password
            </Button>
          </Grid>
        </Grid>
      </PageRoot>
      <DialogUpdateProfile open={openDialogUpdateProfile} onClose={() => setOpenDialogUpdateProfile(false)} />
      <DialogChangePassword open={openDialogChangePassword} onClose={() => setOpenDialogChangePassword(false)} />
    </Fragment>
  );
}
