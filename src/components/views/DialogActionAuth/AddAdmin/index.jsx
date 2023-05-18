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
import { forwardRef, Fragment, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ProfileEditPicture from 'assets/images/icon/ProfileEditPicture.svg';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import { Box } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { addDoc, collection, getDocs, limit, query, where } from 'firebase/firestore';
import { db, otherAuth, storage } from 'config/firebase';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { createUserWithEmailAndPassword, deleteUser, signOut, updateProfile } from 'firebase/auth';
import { validate } from 'react-email-validator';

const DialogAddAdmin = forwardRef(({ open, onClose, ...others }, reference) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isAddAdminProcess, setIsAddAdminProcess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [inputValues, setInputValues] = useState({
    username: '',
    password: '',
    fullname: '',
    email: '',
    showPassword: false
  });

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

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

  const handleAddAdmin = async () => {
    if (!isAddAdminProcess) {
      setIsAddAdminProcess(true);

      if (
        inputValues.username !== '' &&
        inputValues.password !== '' &&
        inputValues.fullname !== '' &&
        inputValues.email !== '' &&
        selectedImage != null
      ) {
        const usernameAlreadyExists =
          !(await getDocs(query(collection(db, 'admins'), where('username', '==', inputValues.username.toLowerCase()), limit(1)))).empty ||
          !(await getDocs(query(collection(db, 'customers'), where('username', '==', inputValues.username.toLowerCase()), limit(1)))).empty;
        const emailAlreadyExists =
          !(await getDocs(query(collection(db, 'admins'), where('email', '==', inputValues.email.toLowerCase()), limit(1)))).empty ||
          !(await getDocs(query(collection(db, 'customers'), where('email', '==', inputValues.email.toLowerCase()), limit(1)))).empty;
        const emailInvalid = !validate("test@email.com");

        if (!usernameAlreadyExists && !emailAlreadyExists && !emailInvalid) {
          let photoUrl = '';
          const profileRef = ref(storage, `/admin-profiles/${inputValues.username}`);
          try {
            const snapshot = await uploadBytes(profileRef, selectedImage);
            photoUrl = await getDownloadURL(snapshot.ref);
          } catch (e) {
            showAlertToast('warning', 'Terjadi kesalahan saat mengupload foto');
          }

          createUserWithEmailAndPassword(otherAuth, inputValues.email, inputValues.password)
            .then((userCredential) => {
              addDoc(collection(db, 'admins'), {
                username: inputValues.username,
                fullname: inputValues.fullname,
                password: inputValues.password,
                email: inputValues.email,
                photoUrl: photoUrl
              })
                .catch(() => {
                  showAlertToast('warning', 'Akun gagal untuk di daftarkan, silahkan coba kembali');
                  setIsAddAdminProcess(false);
                  deleteUser(userCredential.user);
                  deleteObject(profileRef);
                })
                .then(() => {
                  updateProfile(userCredential.user, {
                    displayName: inputValues.username
                  }).then(() => {
                    signOut(otherAuth);
                  });
                  showAlertToast('success', 'Berhasil menambahkan akun admin');
                  setIsAddAdminProcess(false);
                  handleCloseAddAdmin();
                });
            })
            .catch(() => {
              showAlertToast('warning', 'Akun gagal untuk di daftarkan, silahkan coba kembali');
              setIsAddAdminProcess(false);
            });
        } else if (usernameAlreadyExists) {
          showAlertToast('warning', 'Username telah digunakan pada akun lain');
          setIsAddAdminProcess(false);
        } else if (emailAlreadyExists) {
          showAlertToast('warning', 'Email telah digunakan pada akun lain');
          setIsAddAdminProcess(false);
        } else if(emailInvalid){
          showAlertToast('warning', 'Email yang dimasukkan tidak valid');
          setIsAddAdminProcess(false);
        }
      } else {
        showAlertToast('warning', 'Silahkan lengkapi formulir akun dengan benar');
        setIsAddAdminProcess(false);
      }
    }
  };

  const handleCloseAddAdmin = () => {
    if (!isAddAdminProcess) {
      onClose();
      setTimeout(() => {
        setProfileImage(null);
        setInputValues({
          username: '',
          password: '',
          fullname: '',
          email: '',
          showPassword: false
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
        ref={reference}
        open={open}
        {...others}
        fullScreen={fullScreen}
        onClose={handleCloseAddAdmin}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle>
          <Grid container sx={{ position: 'relative', marginTop: 2, marginBottom: 1 }} justifyContent="center" alignItems="center">
            <Typography variant="h3" component="h3">
              Tambah Data Admin
            </Typography>
            <IconButton sx={{ position: 'absolute', right: 0, top: -12 }} color="inherit" onClick={handleCloseAddAdmin} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center" justifyContent="center" gap={3} direction="column" minWidth={{ md: 450 }}>
            <Box sx={{ position: 'relative', width: 200, height: 200 }} marginTop={{ xs: 2 }} marginBottom={{ xs: 1 }}>
              <Avatar sx={{ width: 200, height: 200 }} src={selectedImage ? URL.createObjectURL(selectedImage) : ''} />
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
                    handleAddAdmin();
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
                    handleAddAdmin();
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
                    handleAddAdmin();
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
                    handleAddAdmin();
                    ev.preventDefault();
                  }
                }}
              />
            </FormControl>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleAddAdmin} sx={{ fontSize: 16, fontWeight: 'bold', width: '50%', marginBottom: 2 }}>
              Tambahkan Data
            </Button>
          </Grid>
        </DialogActions>
      </Dialog>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
});

DialogAddAdmin.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func
};

DialogAddAdmin.defaultProps = {
  open: false,
  onClose: () => {}
};

export default DialogAddAdmin;
