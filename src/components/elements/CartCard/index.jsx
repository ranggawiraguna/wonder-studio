import { Box, Button, Grid, InputBase, NativeSelect, Typography, styled } from '@mui/material';
import { useState } from 'react';
import { defaultProductImage } from 'utils/other/EnvironmentValues';
import { moneyFormatter, stringCapitalize } from 'utils/other/Services';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Spacer from '../Spacer';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

export default function CartCard({ cart, product }) {
  const currentPrice =
    product.price ??
    (cart.size != null && cart.model != null
      ? (product.prices ?? []).find((_) => (_.fields ?? []).includes(cart.size) && (_.fields ?? []).includes(cart.model)) ?? {
          value: 0
        }
      : (product.prices ?? []).find((_) => (_.fields ?? []).includes(cart.size) || (_.fields ?? []).includes(cart.model)) ?? {
          value: 0
        }
    ).value;

  const [count, setCount] = useState(cart.count);
  const [size, setSize] = useState(cart.size);
  const [model, setModel] = useState(cart.model);

  const handleChangeDropdown = (prop) => (event) => {
    const value = event?.target.value;
    if (value) {
      if (prop === 'model') {
        setModel(value);
        updateDoc(doc(db, 'carts', cart.id), { model: value });
      } else if (prop === 'size') {
        setSize(value);
        updateDoc(doc(db, 'carts', cart.id), { size: value });
      }
    }
  };

  const handleChangeCount = (status) => {
    if (status === 'increment') {
      const value = (parseInt(count) || 0) + 1;
      setCount(value);
      updateDoc(doc(db, 'carts', cart.id), { count: value });
    } else if (status === 'decrement') {
      if ((count || 0) > 0) {
        const value = count - 1;
        setCount(value);
        updateDoc(doc(db, 'carts', cart.id), { count: value });
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={1} alignItems="stretch">
        <Grid item xs={3} sm={2}>
          <Box
            sx={{
              aspectRatio: 1,
              backgroundColor: 'lightgrey',
              borderRadius: 2,
              width: '100%',
              backgroundImage: `url(${product.images[0] ?? defaultProductImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
        </Grid>
        <Grid item xs={9} sm={10} sx={{ display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', padding: 1, width: '100%' }}>
            <Box>
              <Typography variant="h4" sx={{ marginBottom: 0.5 }}>
                {stringCapitalize(product.name)}
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'normal', color: 'grey' }}>
                {moneyFormatter(currentPrice)} | {product.uom}
              </Typography>
            </Box>
            <Typography variant="h4" sx={{ marginBottom: 0.5, flex: 1, textAlign: 'end', paddingRight: 2, color: 'grey' }}>
              {moneyFormatter(currentPrice * cart.count)}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }} />
          <Box sx={{ padding: 1, width: '100%', display: 'flex', alignItems: 'center', transform: 'translate(-4px,6px)' }}>
            <Box sx={{ flex: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <NativeSelect value={model} onChange={handleChangeDropdown('model')} input={<SelectInput />}>
                {(product.models ?? []).map((_) => (
                  <option value={_}>{stringCapitalize(_)}</option>
                ))}
              </NativeSelect>
              <NativeSelect value={size} onChange={handleChangeDropdown('size')} input={<SelectInput />}>
                {(product.sizes ?? []).map((_) => (
                  <option value={_}>{stringCapitalize(_)}</option>
                ))}
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
                  onClick={() => handleChangeCount('decrement')}
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
                    value={(parseInt(count) || 0) > 0 ? count.toString().replace(/^0+/, '') : ''}
                    onChange={(_) => setCount(_.target.value.replace(/^0+/, ''))}
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
                  onClick={() => handleChangeCount('increment')}
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
            <Button variant="text" sx={{ margin: 0 }} onClick={() => deleteDoc(doc(db, 'carts', cart.id))}>
              <Typography variant="h5" sx={{ color: 'red' }}>
                Hapus
              </Typography>
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Spacer />
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        File Desain
      </Typography>
      <Grid
        container
        spacing={1}
        sx={{
          outline: '2px solid rgba(0,0,0,0.1)',
          borderRadius: 1,
          width: 'calc(100%  - 10px)',
          marginLeft: '2px',
          paddingBottom: 1
        }}
      >
        {cart.images.map((_, __) => (
          <Grid key={__} item xs={1}>
            <Box
              sx={{
                aspectRatio: 1,
                borderRadius: 1,
                width: '100%',
                backgroundColor: 'lightgrey',
                overflow: 'hidden',
                backgroundImage: `url(${_})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          width: 'calc(100% - 10px)',
          height: 3,
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: 1000,
          marginTop: 5,
          marginBottom: 5
        }}
      />
    </Box>
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
