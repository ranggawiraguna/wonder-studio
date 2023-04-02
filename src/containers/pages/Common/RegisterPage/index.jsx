/* eslint-disable no-unused-vars */
import ToolbarStarted from 'components/elements/ToolbarStarted';
import IllustrationTaskManagement from 'assets/images/illustration/TaskManagement.svg';
import PageRoot from './styled';
import AlertToast from 'components/elements/AlertToast';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Fragment, useState } from 'react';
import { Box, Button, CardMedia, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { BoxTransition } from 'components/elements/MotionTransitions';
import { registerSession } from 'utils/redux/reducers/account';

export default function RegisterPage() {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    showPassword: false
  });

  const [isRegisterProcess, setIsRegisterProcess] = useState(false);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const clearAuthForm = () => {
    setValues({
      username: '',
      fullname: '',
      email: '',
      password: '',
      showPassword: false
    });
    setIsRegisterProcess(false);
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = async () => {
    dispatch(
      registerSession({
        data: {
          username: values.username,
          password: values.password,
          fullname: values.fullname,
          email: values.email,
        },
        isRegisterProcess: isRegisterProcess,
        setIsRegisterProcess: setIsRegisterProcess,
        showAlertToast: showAlertToast,
        clearAuthForm: clearAuthForm
      })
    );
  };

  return (
    <Fragment>
      <PageRoot>
        <Box className="box-content">
          <ToolbarStarted
            buttons={[
              {
                text: 'Login Akun',
                link: '/masuk'
              }
            ]}
          />
          <Box className="content-section">
            <BoxTransition variant="fadeZoom" duration={0.25}>
              <h2>Daftar Akun</h2>
              <p>Silahkan isi formulir pendaftaran yang ada dibawah ini untuk daftar membuat akun kamu</p>
              <CardMedia component="img" src={IllustrationTaskManagement} />
              <Box component="form" className="login-form">
                <FormControl variant="outlined" className="input">
                  <InputLabel htmlFor="InputUsername">Nama Lengkap</InputLabel>
                  <OutlinedInput
                    id="InputUFullName"
                    type="text"
                    className="normal-border"
                    value={values.fullname}
                    onChange={handleChange('fullname')}
                    label="Nama Lengkap"
                  />
                </FormControl>
                <FormControl variant="outlined" className="input">
                  <InputLabel htmlFor="InputUsername">Email</InputLabel>
                  <OutlinedInput
                    id="InputEmail"
                    type="text"
                    className="normal-border"
                    value={values.email}
                    onChange={handleChange('email')}
                    label="Email"
                  />
                </FormControl>
                <FormControl variant="outlined" className="input">
                  <InputLabel htmlFor="InputUsername">Username</InputLabel>
                  <OutlinedInput
                    id="InputUsername"
                    type="text"
                    className="normal-border"
                    value={values.username}
                    onChange={handleChange('username')}
                    label="Username"
                  />
                </FormControl>
                <FormControl variant="outlined" className="input">
                  <InputLabel htmlFor="InputPassword">Password</InputLabel>
                  <OutlinedInput
                    id="InputPassword"
                    type={values.showPassword ? 'text' : 'password'}
                    value={values.password}
                    onChange={handleChange('password')}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {values.showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                </FormControl>
                <br />
                <Button onClick={handleRegister} variant="contained">
                  Daftar
                </Button>
              </Box>
            </BoxTransition>
            <BoxTransition variant="fade" duration={0.5}>
              <img src={IllustrationTaskManagement} alt="" />
            </BoxTransition>
          </Box>
        </Box>
      </PageRoot>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}
