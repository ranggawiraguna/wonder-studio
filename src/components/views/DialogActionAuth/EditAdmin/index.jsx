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
  OutlinedInput
} from '@mui/material';
import { useTheme } from '@emotion/react';
import { forwardRef, Fragment, useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import ProfileEditPicture from 'assets/images/icon/ProfileEditPicture.svg';
import PropTypes from 'prop-types';
import AlertToast from 'components/elements/AlertToast';
import { Box } from '@mui/system';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const DialogEditAdmin = forwardRef(({ open, onClose, data, ...others }, reference) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const [isUpdateProcess, setIsUpdateProcess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [inputValues, setInputValues] = useState({
    fullname: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (open) {
      setInputValues({
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
    let data = {};

    if (selectedImage) {
      data = {
        photoUrl: selectedImage
      };
    }

    if (inputValues.fullname !== data.fullname) {
      data = {
        ...data,
        fullname: inputValues.fullname
      };
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

  const handleOnChangeImage = (event) => {
    if (event.target?.files?.[0]) {
      setProfileImage(event.target?.files?.[0]);
    }
  };

  const handleUpdate = async () => {
    if (!isUpdateProcess) {
      setIsUpdateProcess(true);

      const newData = getValueChanged();

      if (Object.keys(data).length > 0) {
        let photoUrl = '';
        try {
          const snapshot = await uploadBytes(ref(storage, `/admin-profiles/${data.username}`), selectedImage);
          photoUrl = await getDownloadURL(snapshot.ref);
        } catch (e) {
          showAlertToast('warning', 'Terjadi kesalahan saat mengupload foto');
        }

        updateDoc(
          doc(db, 'admins', data.username),
          photoUrl
            ? {
                ...newData,
                photoUrl: photoUrl
              }
            : newData
        )
          .then(() => {
            showAlertToast('success', 'Berhasil memperbarui informasi admin');
            setTimeout(() => {
              setIsUpdateProcess(false);
              handleCloseUpdate();
            }, 2000);
          })
          .catch(() => {
            showAlertToast('warning', 'Terjadi kesalahan, silahkan coba kembali');
            setIsUpdateProcess(false);
          });
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
