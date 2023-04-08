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
import AlertToast from 'components/elements/AlertToast';
import { Box } from '@mui/system';
import { doc, updateDoc } from 'firebase/firestore';
import { db, otherAuth, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { signInWithEmailAndPassword, updateEmail, updatePassword, updateProfile } from 'firebase/auth';

const DialogEditAdmin = forwardRef(({ open, onClose, data, ...others }, reference) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [inputValues, setInputValues] = useState({
    email: '',
    username: '',
    password: '',
    fullname: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (open) {
      setInputValues({
        email: data.email,
        username: data.username,
        password: data.password,
        fullname: data.fullname,
        photoUrl: data.photoUrl
      });
    }
  }, [open]);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const getValueChanged = () => {
    let newData = {};

    if (selectedImage) {
      newData = {
        photoUrl: selectedImage
      };
    }

    for (let key of Object.keys(inputValues)) {
      if (key.toString() !== 'showPassword' && key.toString() !== 'photoUrl' && inputValues[key] !== data[key]) {
        newData = {
          ...newData,
          [key]: inputValues[key]
        };
      }
    }

    return newData;
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

  const handleOnChangeImage = (event) => {
    if (event.target?.files?.[0]) {
      setProfileImage(event.target?.files?.[0]);
    }
  };

  const handleUpdate = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      let newData = getValueChanged();

      if (Object.keys(newData).length > 0) {
        if (Object.keys(newData).includes('photoUrl')) {
          try {
            newData = {
              ...newData,
              photoUrl: await getDownloadURL((await uploadBytes(ref(storage, `/admin-profiles/${data.username}`), selectedImage)).ref)
            };
          } catch (e) {
            showAlertToast('warning', 'Terjadi kesalahan saat mengupload foto');
          }
        }

        let error = false;
        if (Object.keys(newData).includes('email') || Object.keys(newData).includes('password')) {
          await signInWithEmailAndPassword(otherAuth, data.email, data.password)
            .catch(() => showAlertToast('warning', 'Terjadi kesalahan,silahkan coba lagi'))
            .then(async (userCredential) => {
              if (userCredential && userCredential.user) {
                if (Object.keys(newData).includes('email')) {
                  try {
                    await updateEmail(userCredential.user, newData.email);
                    await updateDoc(doc(db, 'admins', data.id), { email: newData.email });
                    delete newData.email;
                  } catch (_) {
                    showAlertToast('warning', _.toString());
                    error = true;
                  }
                }
                if (Object.keys(newData).includes('password')) {
                  try {
                    await updatePassword(userCredential.user, newData.password);
                    await updateDoc(doc(db, 'admins', data.id), { password: newData.password });
                    delete newData.password;
                  } catch (_) {
                    showAlertToast('warning', _.toString());
                    error = true;
                  }
                }
                if (Object.keys(newData).includes('username')) {
                  try {
                    await updateProfile(userCredential.user, {
                      displayName: newData.username
                    });
                    await updateDoc(doc(db, 'admins', data.id), { username: newData.username });
                    delete newData.username;
                  } catch (_) {
                    showAlertToast('warning', _.toString());
                    error = true;
                  }
                }
              }
            });
        }

        if (!error) {
          await updateDoc(doc(db, 'admins', data.id), newData).then(() => {
            showAlertToast('success', 'Berhasil memperbarui informasi admin');
            setTimeout(() => {
              setIsUpdateProcess(false);
              handleCloseUpdate();
            }, 2000);
          });
        } else {
          setIsUpdateProcess(false);
        }
      } else {
        showAlertToast('warning', 'Silahkan periksa formulir akun dengan benar');
        setIsUpdateProcess(false);
      }
    }
  };

  const handleCloseUpdate = () => {
    if (!isUpdateProcess) {
      onClose();
      setTimeout(() => {
        setProfileImage(null);
        setInputValues({
          fullname: '',
          photoUrl: ''
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
              Edit Data Admin
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
                alt={data.fullname}
                src={selectedImage ? URL.createObjectURL(selectedImage) : inputValues.photoUrl}
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
              <InputLabel htmlFor="InputUsername">Username</InputLabel>
              <OutlinedInput
                id="InputUsername"
                type="name"
                value={inputValues.username}
                onChange={handleChangeInput('username')}
                label="Username"
                autoComplete="off"
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    handleUpdate();
                    ev.preventDefault();
                  }
                }}
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
              <InputLabel htmlFor="InputPassword">Password</InputLabel>
              <OutlinedInput
                id="InputPassword"
                type={inputValues.showPassword ? 'text' : 'password'}
                value={inputValues.password}
                onChange={handleChangeInput('password')}
                label="Password"
                autoComplete="off"
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setInputValues({ ...inputValues, showPassword: !inputValues.showPassword })}
                      onMouseDown={(event) => {
                        event.preventDefault();
                      }}
                      edge="end"
                    >
                      {inputValues.showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    handleUpdate();
                    ev.preventDefault();
                  }
                }}
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
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    handleUpdate();
                    ev.preventDefault();
                  }
                }}
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
              <InputLabel htmlFor="InputEmail">Email</InputLabel>
              <OutlinedInput
                id="InputEmail"
                type="name"
                value={inputValues.email}
                onChange={handleChangeInput('email')}
                label="Email"
                autoComplete="off"
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter') {
                    handleUpdate();
                    ev.preventDefault();
                  }
                }}
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
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogEditAdmin.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  data: PropTypes.object
};

DialogEditAdmin.defaultProps = {
  open: false,
  onClose: () => {},
  data: {
    username: '',
    fullname: '',
    photoUrl: ''
  }
};

export default DialogEditAdmin;
