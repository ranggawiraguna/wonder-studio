/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  IconButton,
  Grid,
  Typography,
  CardMedia,
  Avatar,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ProfileEditPicture from 'assets/images/icon/ProfileEditPicture.svg';
import PropTypes from 'prop-types';
import IllustrationProfileChangePassword from 'assets/images/illustration/ProfileChangePassword.svg';
import AlertToast from 'components/elements/AlertToast';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { updateIdentity } from 'utils/redux/reducers/account';
import { auth } from 'config/firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';

const DialogUpdateProfile = forwardRef(({ open, onClose, ...others }, ref) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const accountReducer = useSelector((state) => state.accountReducer);

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const [isVerifyProcess, setIsVerifyProcess] = useState(false);
  const [openVerifyPassword, setOpenVerifyPassword] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [inputValues, setInputValues] = useState({
    email: '',
    fullname: '',
    passwordVerify: '',
    showPasswordVerify: false
  });

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  useEffect(() => {
    if (open) {
      setInputValues({
        ...inputValues,
        email: accountReducer.email,
        fullname: accountReducer.fullname
      });
    }
  }, [open]);

  const getValueChanged = () => {
    let data = {};

    if (selectedImage) {
      data = {
        photoUrl: selectedImage
      };
    }

    for (let key of ['email', 'fullname']) {
      if (inputValues[key] !== accountReducer[key]) {
        data = {
          ...data,
          [key]: inputValues[key]
        };
      }
    }

    return data;
  };

  const setProfileImage = (value) => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }
    setSelectedImage(value);
  };

  const handleChangeInput = (prop) => (event) => {
    setInputValues({ ...inputValues, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setInputValues({
      ...inputValues,
      showPasswordVerify: !inputValues.showPasswordVerify
    });
  };

  const handleOnChangeImage = (event) => {
    if (event.target?.files?.[0]) {
      setProfileImage(event.target?.files?.[0]);
    }
  };

  const handleUpdate = () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      const data = getValueChanged();

      if (Object.keys(data).length > 0) {
        if (data['email']) {
          if (data['email'].substring(data['email'].length - 10, data['email'].length) === '@gmail.com') {
            setOpenVerifyPassword(true);
          } else {
            showAlertToast('warning', 'Email harus merupakan akun google mail');
            setIsUpdateProcess(false);
          }
        } else {
          dispatch(
            updateIdentity({
              account: accountReducer,
              data: data,
              setIsUpdateProcess: setIsUpdateProcess,
              showAlert: showAlertToast,
              handleClose: () => {
                onClose();
                setTimeout(() => {
                  setProfileImage(null);
                  setOpenVerifyPassword(false);
                  setInputValues({
                    ...inputValues,
                    email: '',
                    fullname: ''
                  });
                }, 500);
              }
            })
          );
        }
      } else {
        setIsUpdateProcess(false);
      }
    }
  };

  const handleVerify = async () => {
    if (!isVerifyProcess) {
      setIsVerifyProcess(true);

      let userCredential;
      try {
        userCredential = await reauthenticateWithCredential(
          auth.currentUser,
          EmailAuthProvider.credential(accountReducer.email, inputValues.passwordVerify)
        );
      } catch (e) {
        if (e.code === 'auth/wrong-password') {
          userCredential = 'auth/wrong-password';
        }
      }

      if (userCredential && userCredential.user) {
        handleCloseVerify();
        updateEmail(userCredential.user, inputValues.email)
          .then(() => {
            dispatch(
              updateIdentity({
                account: accountReducer,
                data: getValueChanged(),
                setIsUpdateProcess: setIsUpdateProcess,
                showAlert: showAlertToast,
                handleClose: () => {
                  onClose();
                  setTimeout(() => {
                    setProfileImage(null);
                    setOpenVerifyPassword(false);
                    setInputValues({
                      ...inputValues,
                      email: '',
                      fullname: ''
                    });
                  }, 500);
                }
              })
            );
          })
          .catch((error) => {
            showAlertToast('warning', error.message);
            handleCloseVerify();
          });
      } else if (userCredential === 'auth/wrong-password') {
        showAlertToast('error', 'Password yang dimasukkan salah');
        handleCloseVerify();
      } else {
        showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
        handleCloseVerify();
      }
    }
  };

  const handleCloseUpdate = () => {
    if (!isUpdateProcess) {
      onClose();
      setTimeout(() => {
        setProfileImage(null);
        setOpenVerifyPassword(false);
        setInputValues({
          ...inputValues,
          email: '',
          fullname: ''
        });
      }, 500);
    }
  };

  const handleCloseVerify = () => {
    if (!isVerifyProcess) {
      setIsUpdateProcess(false);
      setOpenVerifyPassword(false);
      setTimeout(() => {
        setIsVerifyProcess(false);
        setInputValues({
          ...inputValues,
          passwordVerify: '',
          showPasswordVerify: false
        });
      }, 500);
    }
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  return (
    <Fragment>
      <Dialog
        ref={ref}
        open={open}
        {...others}
        fullScreen={fullScreen}
        onClose={handleCloseUpdate}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Edit Profil
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseUpdate} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" justifyContent="center" gap={3} direction="column" minWidth={{ md: 450 }}>
            <Box sx={{ position: 'relative', width: 200, height: 200 }} marginTop={{ xs: 2 }} marginBottom={{ xs: 1 }}>
              <Avatar
                sx={{ width: 200, height: 200 }}
                alt={accountReducer.fullname}
                src={selectedImage ? URL.createObjectURL(selectedImage) : accountReducer.photoUrl}
              />
              <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 60, height: 60 }}>
                <input
                  sx={{ margin: 0, padding: 0, borderRadius: 1000, width: 60, height: 60 }}
                  hidden
                  id="picture-file"
                  accept="image/*"
                  type="file"
                  onChange={handleOnChangeImage}
                />
                <label sx={{ margin: 0, padding: 0, borderRadius: 1000, width: 60, height: 60 }} htmlFor="picture-file">
                  <Button sx={{ margin: 0, padding: 0, borderRadius: 1000, width: 60, height: 60 }} variant="raised" component="span">
                    <CardMedia
                      sx={{ margin: 0, padding: 0, borderRadius: 1000, width: 60, height: 60 }}
                      component="img"
                      src={ProfileEditPicture}
                    />
                  </Button>
                </label>
              </Box>
            </Box>
            <FormControl
              sx={{
                width: '90%',
                fontSize: 30,
                input: { fontSize: 18, fontWeight: 'normal' },
                label: { fontSize: 16, fontWeight: 'normal' },
                span: { fontSize: 12, fontWeight: 'normal' }
              }}
              variant="outlined"
              className="input"
            >
              <InputLabel htmlFor="InputEmail">Email</InputLabel>
              <OutlinedInput
                id="InputEmail"
                type="email"
                value={inputValues.email}
                onChange={handleChangeInput('email')}
                label="Email"
                autoComplete="off"
              />
            </FormControl>
            <FormControl
              sx={{
                width: '90%',
                fontSize: 30,
                input: { fontSize: 18, fontWeight: 'normal' },
                label: { fontSize: 16, fontWeight: 'normal' },
                span: { fontSize: 12, fontWeight: 'normal' }
              }}
              variant="outlined"
              className="input"
            >
              <InputLabel htmlFor="InputNamaLengkap">Nama Lengkap</InputLabel>
              <OutlinedInput
                id="InputNamaLengkap"
                type="name"
                value={inputValues.fullname}
                onChange={handleChangeInput('fullname')}
                label="NamaLengkap"
                autoComplete="off"
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleUpdate} sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}>
              Terapkan Perubahan
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <Dialog
        ref={ref}
        open={openVerifyPassword}
        fullScreen={fullScreen}
        onClose={handleCloseVerify}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Konfirmasi Perubahan
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseVerify} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container textAlign="center" alignItems="center" justifyContent="center" gap={3} direction="column" minWidth={{ md: 450 }}>
            <Grid container direction="column" alignItems="center">
              <Typography
                variant="p"
                component="p"
                sx={{
                  marginBottom: { xs: 5, md: 3 },
                  fontSize: 18,
                  lineHeight: 1.2,
                  width: '80%'
                }}
              >
                Masukkan password untuk dapat
                <br />
                melanjutkan perubahan pada profil kamu
              </Typography>
              <CardMedia
                component="img"
                src={IllustrationProfileChangePassword}
                sx={{ marginTop: 3, marginBottom: 1, width: 240, height: 240 }}
              />
            </Grid>
            <FormControl
              sx={{
                width: '80%',
                fontSize: 30,
                input: { fontSize: 18, fontWeight: 'normal' },
                label: { fontSize: 16, fontWeight: 'normal' },
                span: { fontSize: 12, fontWeight: 'normal' }
              }}
              variant="outlined"
              className="input"
            >
              <InputLabel htmlFor="InputPassword">Password</InputLabel>
              <OutlinedInput
                id="InputPassword"
                type={inputValues.showPasswordVerify ? 'text' : 'password'}
                value={inputValues.passwordVerify}
                onChange={handleChangeInput('passwordVerify')}
                label="Password"
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      edge="end"
                    >
                      {inputValues.showPasswordVerify ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleVerify} sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}>
              Konfirmasi Perubahan
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>

      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogUpdateProfile.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

DialogUpdateProfile.defaultProps = {
  open: false,
  onClose: () => {}
};

export default DialogUpdateProfile;
