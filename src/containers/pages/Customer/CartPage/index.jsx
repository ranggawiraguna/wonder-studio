import PerfectScrollbar from 'react-perfect-scrollbar';
import React, { useState } from 'react';
import { Box, Button, Grid, InputBase, NativeSelect, TextField, Typography, styled } from '@mui/material';
import { Fragment, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import EastIcon from '@mui/icons-material/East';
import { faker } from '@faker-js/faker';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Spacer from 'components/elements/Spacer';

export default function CartPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const [countCart, setCountCart] = useState(0);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'cart') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'cart' });
    }
    return () => {
      //
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Box
            sx={{
              backgroundColor: 'rgba(255,255,255,0.75)',
              borderRadius: 5,
              width: '100%',
              height: 'calc(100vh - 130px)',
              display: 'flex',
              paddingLeft: 3,
              paddingRight: 1,
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Typography variant="h3" sx={{ marginBottom: 1.5, marginTop: 3, marginRight: 1 }}>
              Keranjang Saya
            </Typography>
            <Box sx={{ backgroundColor: 'whitesmoke', height: '2px', borderRadius: 10, marginRight: 2 }} />
            <PerfectScrollbar style={{ marginLeft: 3, marginRight: 1, paddingRight: 3, paddingBottom: 2, flex: 1, overflow: 'auto' }}>
              <Spacer />
              {Array.from(Array(10).keys()).map(() => (
                <Box sx={{ width: '100%' }}>
                  <Grid container spacing={1} alignItems="stretch">
                    <Grid item xs={3} sm={2}>
                      <Box
                        sx={{
                          aspectRatio: 1,
                          backgroundColor: 'lightgrey',
                          borderRadius: 2,
                          width: '100%',
                          backgroundImage: `url(${faker.image.image(null, null, true)})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    </Grid>
                    <Grid item xs={9} sm={10} sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', padding: 1, width: '100%' }}>
                        <Box>
                          <Typography variant="h4" sx={{ marginBottom: 0.5 }}>
                            {stringCapitalize(faker.lorem.words(5))}
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'grey' }}>
                            {moneyFormatter(Math.floor(Math.random() * 100) * 1000 + 100000)} | {'Lembar'}
                          </Typography>
                        </Box>
                        <Typography variant="h4" sx={{ marginBottom: 0.5, flex: 1, textAlign: 'end', paddingRight: 2, color: 'grey' }}>
                          {moneyFormatter((Math.floor(Math.random() * 100) * 1000 + 100000) * 3)}
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }} />
                      <Box sx={{ padding: 1, width: '100%', display: 'flex', alignItems: 'center', transform: 'translate(-4px,6px)' }}>
                        <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          <NativeSelect value={'Bagus'} input={<SelectInput />}>
                            <option value={'Bagus'}>Bagus</option>
                            <option value={'Biasa'}>Biasa</option>
                          </NativeSelect>
                          <NativeSelect value={'1m x 1m'} input={<SelectInput />}>
                            <option value={'1m x 1m'}>1m x 1m</option>
                            <option value={'2m x 2m'}>2m x 2m</option>
                            <option value={'3m x 3m'}>3m x 3m</option>
                          </NativeSelect>
                          <Box
                            sx={{
                              backgroundColor: 'white',
                              outline: '2px solid #ced4da',
                              marginLeft: 0.75,
                              borderRadius: 1,
                              width: 100,
                              boxSizing: 'border-box',
                              padding: 0.5,
                              display: 'flex'
                            }}
                          >
                            <Box
                              onClick={() => ((countCart || 0) > 0 ? setCountCart(countCart - 1) : null)}
                              sx={{
                                aspectRatio: 1,
                                display: 'flex',
                                cursor: 'pointer',
                                justifyContent: 'center',
                                height: '100%',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: 1
                              }}
                            >
                              <RemoveIcon fontSize="15px" />
                            </Box>
                            <Box sx={{ flex: 1 }}>
                              <InputBase
                                margin="dense"
                                fullWidth
                                value={(parseInt(countCart) || 0) > 0 ? countCart.toString().replace(/^0+/, '') : ''}
                                onChange={(_) => setCountCart(_.target.value.replace(/^0+/, ''))}
                                inputProps={{ maxLength: 4 }}
                                sx={{
                                  textAlign: 'center',
                                  fontSize: 12,
                                  '& input': {
                                    fontSize: 12,
                                    padding: 0,
                                    textAlign: 'center'
                                  }
                                }}
                                align="center"
                              />
                            </Box>
                            <Box
                              onClick={() => setCountCart((parseInt(countCart) || 0) + 1)}
                              sx={{
                                aspectRatio: 1,
                                height: '100%',
                                display: 'flex',
                                cursor: 'pointer',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                borderRadius: 1
                              }}
                            >
                              <AddIcon fontSize="15px" />
                            </Box>
                          </Box>
                        </Box>
                        <Button variant="text" sx={{ margin: 0 }}>
                          <Typography variant="h5" sx={{ color: 'red' }}>
                            Hapus
                          </Typography>
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                  <hr color="whitesmoke" />
                </Box>
              ))}
            </PerfectScrollbar>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <PerfectScrollbar>
            <Box
              sx={{
                backgroundColor: 'rgba(255,255,255,0.75)',
                borderRadius: 5,
                width: '100%',
                height: 'calc(100vh - 130px)',
                padding: 3,
                display: 'flex',
                alignItems: 'stretch',
                flexDirection: 'column'
              }}
            >
              <Typography variant="h3" sx={{ marginBottom: 1.5 }}>
                Detail Pesanan
              </Typography>
              <Box sx={{ backgroundColor: 'whitesmoke', height: '2px', borderRadius: 10 }} />
              <Spacer />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField label="Nama Lengkap" variant="outlined" fullWidth />
                <TextField label="Nomor Telepon" variant="outlined" fullWidth />
                <TextField label="Alamat" variant="outlined" fullWidth multiline minRows={5} />
              </Box>
              <Box sx={{ flex: 1 }} />
              <Box sx={{ height: '1px', width: '100%', backgroundColor: 'lightgrey', marginBottom: 2 }} />
              <Typography variant="h4" sx={{ marginBottom: 1}}>
                Total Pesanan
              </Typography>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Jumlah Produk
                </Typography>
                <Typography variant="h5" sx={{ flex: 1, textAlign: 'end', fontWeight: 'bold' }}>
                  {Math.floor(Math.random() * 100)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                  Jumlah Harga
                </Typography>
                <Typography variant="h5" sx={{ flex: 1, textAlign: 'end', fontWeight: 'bold' }}>
                  {moneyFormatter((Math.floor(Math.random() * 100) * 1000 + 100000) * 10)}
                </Typography>
              </Box>
              <Button variant="contained" sx={{ display: 'flex', gap: '10px', padding: '10px 25px', marginTop: 2 }}>
                <Typography variant="h4" sx={{ color: 'white', flex: 1, textAlign: 'start' }}>
                  Buat Pesanan
                </Typography>
                <EastIcon />
              </Button>
            </Box>
          </PerfectScrollbar>
        </Grid>
      </Grid>
    </Fragment>
  );
}

const SelectInput = styled(InputBase)(() => ({
  paddingRight: '3px',
  minWidth: 0,
  minHeight: 0,
  '& .MuiInputBase-input': {
    minWidth: 0,
    minHeight: 0,
    transform: 'translateX(6px)',
    backgroundColor: 'white',
    fontSize: 12,
    outline: '2px solid #ced4da',
    border: '2px solid white',
    borderRadius: 4,
    padding: '3px 8px 3px 8px'
  },
  '&:focus': {
    minWidth: 0,
    minHeight: 0,
    transform: 'translateX(6px)',
    backgroundColor: 'white',
    fontSize: 12,
    outline: '2px solid #ced4da',
    border: '2px solid white',
    borderRadius: 4,
    padding: '3px 8px 3px 8px'
  }
}));
