import { Backdrop, Box, Button, CardMedia, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import IconTrackingCurrent from 'assets/images/icon/TrackingCurrentPosition.svg';
import IconTrackingOther from 'assets/images/icon/TrackingOtherPosition.svg';
import Component from './styled';
import { orderProcess, orderProcessDetail } from 'utils/other/EnvironmentValues';
import FieldGroupView from 'components/elements/FieldGroupView';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';
import OrderItem from 'components/elements/OrderItem';
import DialogUpdateOrderProcess from 'components/views/DialogActionOrder/UpdateOrderProcess';
import { useSelector } from 'react-redux';

export default function OrderView({ data }) {
  const accountReducer = useSelector((state) => state.accountReducer);

  const [isOpenDialogUpdateProcess, setOpenDialogUpdateProcess] = useState(false);
  const [isOpenBackdropTransactionImage, setIsOpenBackdropTransactionImage] = useState(false);

  return Object.keys(data).length > 0 ? (
    <Fragment>
      <Component>
        <Box gridArea="A">
          <Box>
            <Typography variant="h2" component="h2">
              Detail Pesanan
            </Typography>
          </Box>
          <Box>
            <FieldGroupView title="No. Pesanan" data={data.id} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView title="Nama Pelanggan" data={data.name} sx={{ marginBottom: '30px' }} withFrame />
            <FieldGroupView title="Nomor Telepon" data={data.phoneNumber} sx={{ marginBottom: '30px' }} withFrame />
            <Typography variant="h4" component="h4" sx={{ color: '#666666', marginBottom: '10px', marginLeft: '2px' }}>
              Daftar Produk
            </Typography>
            {data.products?.map((product, index) => (
              <OrderItem
                key={index}
                data={product}
                sx={{
                  marginBottom: '10px',
                  paddingBottom: '10px'
                }}
              />
            ))}
            <FieldGroupView title="Alamat Tujuan" data={data.address} sx={{ marginTop: '20px', marginBottom: '20px' }} />
            <FieldGroupView
              title="Tanggal Pesanan Dibuat"
              data={dateFormatter(data.dateCreated, 'eeee, d MMMM yyyy - HH:mm')}
              sx={{ marginBottom: '20px' }}
            />
            {data.dateFinished ? (
              <FieldGroupView
                title="Tanggal Pesanan Selesai"
                data={data.dateFinished ? dateFormatter(data.dateFinished, 'eeee, d MMMM yyyy - HH:mm') : '-'}
              />
            ) : (
              <></>
            )}
          </Box>
        </Box>
        <Box gridArea="B">
          <Box>
            <Typography variant="h2" component="h2">
              Proses Pelacakan
            </Typography>
            {accountReducer.role === 'admin' ? (
              <Button variant="contained" onClick={() => setOpenDialogUpdateProcess(true)}>
                Edit Proses
              </Button>
            ) : (
              <></>
            )}
          </Box>
          <Box>
            <Box>
              {data.processTracking.map((e, i) => {
                return (
                  <Fragment key={i}>
                    <Typography variant="p" component="p">
                      {dateFormatter(e.date, 'dd/MM/yyyy')}
                      <br />
                      {dateFormatter(e.date, 'HH:mm')}
                    </Typography>
                    <Box component="span">
                      <CardMedia
                        component="img"
                        src={i === data.processTracking.length - 1 ? IconTrackingCurrent : IconTrackingOther}
                        sx={i === data.processTracking.length - 1 ? { backgroundColor: 'white', transform: 'scale(1.25)' } : {}}
                      />
                      <Box sx={{ top: i === 0 ? '15px' : 0, height: i === data.processTracking.length - 1 ? '10px' : '100%' }} />
                    </Box>
                    <Box component="div">
                      <Typography variant="p" component="p">
                        {orderProcessDetail[e.name].title}
                      </Typography>
                      <Typography variant="p" component="p">
                        {orderProcessDetail[e.name].description}
                      </Typography>
                      {e.name === orderProcess.waitingPayment ? (
                        <Fragment>
                          <Typography variant="p" component="p">
                            Status Pembayaran :&nbsp; {data.transactionInfo.image ? 'Sudah' : 'Belum'} di upload
                          </Typography>
                          <Button
                            variant="contained"
                            className={data.transactionInfo.image ? 'active' : 'inactive'}
                            onClick={
                              data.transactionInfo.image
                                ? () => {
                                    document.body.style = 'overflow: hidden';
                                    setIsOpenBackdropTransactionImage(true);
                                  }
                                : null
                            }
                          >
                            Lihat Pembayaran
                          </Button>
                        </Fragment>
                      ) : (
                        <></>
                      )}
                    </Box>
                  </Fragment>
                );
              })}
            </Box>
          </Box>
        </Box>
        <Box gridArea="C">
          <Typography variant="h3" component="h3">
            Total Pesanan
          </Typography>
          <Box>
            <Typography variant="h5" component="h5">
              Jumlah Produk
            </Typography>
            <Typography variant="p" component="p">
              {data.products ? data.products.reduce((a, b) => a + b.count, 0) : 0}
            </Typography>
            <Typography variant="h5" component="h5">
              Jumlah Harga Produk
            </Typography>
            <Typography variant="p" component="p">
              {moneyFormatter(data.products ? data.products.reduce((a, b) => a + b.price, 0) : 0)}
            </Typography>
            <Typography variant="h5" component="h5">
              Jumlah Biaya Pengiriman
            </Typography>
            <Typography variant="p" component="p">
              {moneyFormatter(data.shippingInfo?.price ?? 0)}
            </Typography>
            <Typography variant="h5" component="h5">
              Jumlah Pembayaran
            </Typography>
            <Typography variant="p" component="p">
              {data.products ? moneyFormatter(data.products.reduce((a, b) => a + b.price, 0) + (data.shippingInfo?.price ?? 0)) : 'Rp. -'}
            </Typography>
          </Box>
        </Box>
      </Component>
      <DialogUpdateOrderProcess open={isOpenDialogUpdateProcess} onClose={() => setOpenDialogUpdateProcess(false)} data={data} />
      {(() => {
        return data.transactionInfo?.image ? (
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: '2vw' }}
            open={isOpenBackdropTransactionImage}
            onClick={() => {
              document.body.style = '';
              setIsOpenBackdropTransactionImage(false);
            }}
          >
            <Box
              sx={{
                width: '100%',
                height: '100%',
                backgroundImage: `url(${data.transactionInfo.image})`,
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
  ) : (
    <></>
  );
}
