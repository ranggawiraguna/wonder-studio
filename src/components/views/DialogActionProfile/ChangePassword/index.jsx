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
  InputAdornment,
  FormControl,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import IllustrationProfileChangePassword from 'assets/images/illustration/ProfileChangePassword.svg';
import { useSelector } from 'react-redux';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from 'config/firebase';

const DialogChangePassword = forwardRef(({ open, onClose, ...others }, ref) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const accountReducer = useSelector((state) => state.accountReducer);

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);

  const [inputValues, setInputValues] = useState({
    old: '',
    new: '',
    newConfirm: '',
    showOldPassword: false,
    showNewPassword: false,
    showNewConfirmPassword: false
  });

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const handleChangeInput = (prop) => (event) => {
    setInputValues({ ...inputValues, [prop]: event.target.value });
  };

  const handleClickShowPassword = (prop) => () => {
    setInputValues({
      ...inputValues,
      [prop]: !inputValues[prop]
    });
  };

  const handleUpdatePassword = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      if (inputValues.old === inputValues.new || inputValues.old === inputValues.newConfirm) {
        showAlertToast('error', 'Password lama tidak boleh sama dengan password yang baru');
        setIsUpdateProcess(false);
      } else if (inputValues.new !== inputValues.newConfirm) {
        showAlertToast('error', 'Password baru yang dimasukkan tidak cocok');
        setIsUpdateProcess(false);
      } else if (inputValues.new.length < 8 || inputValues.newConfirm.length < 8) {
        showAlertToast('error', 'Password harus terdiri dari minimal 8 karakter');
        setIsUpdateProcess(false);
      } else {
        let userCredential;
        try {
          userCredential = await reauthenticateWithCredential(
            auth.currentUser,
            EmailAuthProvider.credential(accountReducer.email, inputValues.old)
          );
        } catch (e) {
          if (e.code === 'auth/wrong-password') {
            userCredential = 'auth/wrong-password';
          }
        }

        if (userCredential && userCredential.user) {
          updatePassword(userCredential.user, inputValues.new)
            .then(() => {
              showAlertToast('success', 'Berhasil memperbarui password akun');
              handleClose();
              setIsUpdateProcess(false);
            })
            .catch((error) => {
              showAlertToast('warning', error.message);
              handleClose();
              setIsUpdateProcess(false);
            });
        } else if (userCredential === 'auth/wrong-password') {
          showAlertToast('error', 'Password lama yang dimasukkan salah');
          setIsUpdateProcess(false);
        } else {
          showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
          handleClose();
          setIsUpdateProcess(false);
        }
      }
    }
  };

  const handleClose = () => {
    onClose();
    setInputValues({
      old: '',
      new: '',
      newConfirm: '',
      showOldPassword: false,
      showNewPassword: false,
      showNewConfirmPassword: false
    });
  };

  return (
    <Fragment>
      <Dialog ref={ref} open={open} {...others} fullScreen={fullScreen} onClose={handleClose} aria-labelledby="responsive-dialog-title">
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Ubah Password
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent sx={{ textAlign: 'center' }}>
          <Grid container direction="column" alignItems="center">
            <CardMedia component="img" src={IllustrationProfileChangePassword} sx={{ width: 240, height: 240 }} />
            <Typography variant="h3" component="h3" marginTop={3} marginBottom={1}>
              Buat Password Baru
            </Typography>
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
              Kata sandi baru kamu harus berbeda dari
              <br />
              kata sandi yang digunakan sebelumnya
            </Typography>
          </Grid>
          <Grid container alignItems="center" justifyContent="center" gap={3} direction="column" minWidth={{ md: 450 }}>
            {['old', 'new', 'newConfirm'].map((key) => {
              const labels = {
                old: 'Password Lama',
                new: 'Password Baru',
                newConfirm: 'Konfirmasi Password Baru'
              };

              const toggleShow = `show${key.at(0).toUpperCase()}${key.substring(1, key.length)}Password`;

              return (
                <FormControl
                  key={key}
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
                  <InputLabel htmlFor={`Input${labels[key].replace(' ', '')}`}>{labels[key]}</InputLabel>
                  <OutlinedInput
                    id={`Input${labels[key]}`}
                    type={inputValues[toggleShow] ? 'text' : 'password'}
                    value={inputValues[key]}
                    onChange={handleChangeInput(key)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword(toggleShow)}
                          onMouseDown={(event) => {
                            event.preventDefault();
                          }}
                          edge="end"
                        >
                          {inputValues[toggleShow] ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label={labels[key]}
                  />
                </FormControl>
              );
            })}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button
              variant="contained"
              autoFocus
              onClick={handleUpdatePassword}
              sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}
            >
              Terapkan Perubahan
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogChangePassword.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

DialogChangePassword.defaultProps = {
  open: false,
  onClose: () => {}
};

export default DialogChangePassword;
