import { Backdrop, Box, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import { orderType } from 'utils/other/EnvironmentValues';
import { moneyFormatter } from 'utils/other/Services';
import Component from './styled';

export default function OrderItem({ info, ...props }) {
  const [imageBackdrop, setImageBackdrop] = useState(info.productPhotoUrl);
  const [isOpenImageBackdrop, setIsOpenImageBackdrop] = useState(false);

  return (
    <Fragment>
      <Component
        {...props}
        gridTemplateAreas={
          info.type === orderType.customization
            ? `
                "A A A"
                "C C C"
                "D D D"
                "E E E"
              `
            : `
                "A B B"
                "A C C"
                "A D D"
                "A E F"
              `
        }
        gridTemplateColumns={'auto 1fr auto'}
      >
        {(() => {
          return info.type === orderType.customization ? (
            <Box
              gridArea="A"
              sx={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginBottom: '10px',
                padding: '10px',
                backgroundColor: 'white',
                border: '3px solid rgba(136,136,136,0.25)',
                borderRadius: '12px'
              }}
            >
              {(() => {
                return info.images.map((image, index) => (
                  <Box
                    key={index}
                    onClick={() => {
                      document.body.style = 'overflow:hidden';
                      setImageBackdrop(image);
                      setIsOpenImageBackdrop(true);
                    }}
                    sx={{
                      backgroundImage: `url(${image})`,
                      backgroundRepeat: 'no-repeat',
                      width: '100px',
                      height: '100px',
                      borderRadius: '10px',
                      backgroundColor: '#EEEEEE',
                      backgroundSize: 'cover',
                      cursor: 'pointer',
                      backgroundPosition: 'center'
                    }}
                  />
                ));
              })()}
            </Box>
          ) : (
            <Box
              gridArea="A"
              sx={{
                backgroundImage: `url(${info.productPhotoUrl})`,
                backgroundRepeat: 'no-repeat',
                width: '100px',
                height: '100px',
                borderRadius: '10px',
                backgroundColor: '#EEEEEE',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          );
        })()}
        {(() => {
          return info.type === orderType.customization ? (
            <></>
          ) : (
            <Typography gridArea="B" variant="p" component="p" sx={info.type !== orderType.order ? { paddingBottom: '10px' } : {}}>
              {info.productName}
            </Typography>
          );
        })()}
        <Box gridArea="C" sx={info.type !== orderType.order ? { paddingBottom: '5px' } : {}}>
          <Typography variant="p" component="p">
            Warna :
          </Typography>
          <Box sx={{ backgroundColor: info.color, border: '1px solid lightgrey' }} />
        </Box>
        <Box gridArea="D" sx={info.type !== orderType.order ? { paddingBottom: '5px' } : {}}>
          <Typography variant="p" component="p">
            {info.type === orderType.order ? 'Ukuran' : 'Ukuran & Jumlah'} :
          </Typography>
          {(() => {
            return info.type === orderType.order ? (
              <Box sx={{ backgroundColor: 'lightgrey' }}>
                <Typography variant="p" component="p">
                  {info.size}
                </Typography>
              </Box>
            ) : (
              <></>
            );
          })()}
        </Box>

        {info.type === orderType.order ? (
          <Typography gridArea="E" variant="p" component="p">
            Jumlah : {info.count}
          </Typography>
        ) : (
          <Box gridArea="E">
            {info.sizes.map((size, index) => (
              <Box key={index} sx={{ display: 'flex', gap: '10px', paddingLeft: '10px', paddingTop: '5px' }}>
                <Typography
                  variant="p"
                  component="p"
                  sx={{
                    backgroundColor: 'lightgrey',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 1000,
                    width: '20px',
                    height: '20px',
                    fontSize: '9px',
                    letterSpacing: 0.25,
                    fontWeight: 'bold'
                  }}
                >
                  {size.name}
                </Typography>
                <Typography variant="p" component="p">
                  ⤑
                </Typography>
                <Typography variant="p" component="p">
                  {size.count} Produk
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        {(() => {
          return info.type === orderType.customization ? (
            <></>
          ) : (
            <Typography gridArea="F" variant="p" component="p" sx={info.type !== orderType.order ? { alignSelf: 'flex-end' } : {}}>
              {moneyFormatter(info.price ? info.price : '-')}
            </Typography>
          );
        })()}
      </Component>
      {(() => {
        return info.type === orderType.customization ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: '2vw' }}
            open={isOpenImageBackdrop}
            onClick={() => {
              document.body.style = '';
              setIsOpenImageBackdrop(false);
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${imageBackdrop})`,
                backgroundPosition: 'center',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
              }}
            />
          </Backdrop>
        ) : (
          <></>
        );
      })()}
    </Fragment>
  );
}
