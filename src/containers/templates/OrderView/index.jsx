import { Backdrop, Box, Button, CardMedia, Typography } from '@mui/material';
import { Fragment, useState } from 'react';
import IconTrackingCurrent from 'assets/images/icon/TrackingCurrentPosition.svg';
import IconTrackingOther from 'assets/images/icon/TrackingOtherPosition.svg';
import Component from './styled';
import { orderProcess, orderProcessDetail, orderType } from 'utils/other/EnvironmentValues';
import FieldGroupView from 'components/elements/FieldGroupView';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';
import OrderItem from 'components/elements/OrderItem';
import DialogUpdateOrderProcess from 'components/views/DialogActionOrder/UpdateOrderProcess';
import DialogUpdateOrderPrice from 'components/views/DialogActionOrder/UpdateOrderPrice';

export default function OrderView({ data }) {
  const [isOpenDialogUpdateProcess, setOpenDialogUpdateProcess] = useState(false);
  const [isOpenDialogUpdatePrice, setOpenDialogUpdatePrice] = useState(false);
  const [isOpenBackdropTransactionImage, setIsOpenBackdropTransactionImage] = useState(false);

  return (
    <Fragment>
      <Component>
        <Box gridArea="A">
          <Box>
            <Typography variant="h2" component="h2">
              Detail Pesanan
            </Typography>
            <Button
              variant="contained"
              disabled={orderType.customization ? false : true}
              sx={{ opacity: data.type === orderType.customization ? 1 : 0 }}
              onClick={orderType.customization ? () => setOpenDialogUpdatePrice(true) : null}
            >
              Edit Harga
            </Button>
          </Box>
          <Box>
            <FieldGroupView title="No. Pesanan" data={data.id} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView title="Username Pelanggan" data={data.customerId} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView title="Nama Pelanggan" data={data.customerName} sx={{ marginBottom: '30px' }} withFrame />
            <Typography variant="h4" component="h4" sx={{ color: '#666666', marginBottom: '10px', marginLeft: '2px' }}>
              {data.type === orderType.customization ? 'Keterangan Kustomisasi' : 'Daftar Produk'}
            </Typography>
            {(() => {
              return data.type === orderType.customization ? (
                <OrderItem info={{ ...data.otherInfo, images: data.orderInfo.images }} sx={{ marginBottom: '10px' }} />
              ) : (
                data.otherInfo.map((item, index) => (
                  <OrderItem
                    key={index}
                    info={item}
                    sx={{
                      marginBottom: '10px',
                      paddingBottom: data.type !== orderType.order && index !== data.otherInfo.length - 1 ? '30px' : '10px'
                    }}
                  />
                ))
              );
            })()}
            <FieldGroupView title="Catatan Pesanan" data={data.textNotes} sx={{ marginTop: '30px', marginBottom: '20px' }} />
            <FieldGroupView title="Alamat Tujuan" data={data.destinationAddress} sx={{ marginBottom: '20px' }} />
            <FieldGroupView title="Opsi Pengiriman" data={data.shippingInfo.name} sx={{ marginBottom: '20px' }} />
            <FieldGroupView title="Metode Pembayaran" data={data.paymentMethod} sx={{ marginBottom: '20px' }} />
            <FieldGroupView
              title="Tanggal Pesanan Dibuat"
              data={dateFormatter(data.dateCreated, 'eeee, d MMMM yyyy - HH:mm')}
              sx={{ marginBottom: '20px' }}
            />
            <FieldGroupView
              title="Tanggal Pesanan Selesai"
              data={data.dateFinished ? dateFormatter(data.dateFinished, 'eeee, d MMMM yyyy - HH:mm') : '-'}
            />
          </Box>
        </Box>
        <Box gridArea="B">
          <Box>
            <Typography variant="h2" component="h2">
              Proses Pelacakan
            </Typography>
            <Button variant="contained" onClick={() => setOpenDialogUpdateProcess(true)}>
              Edit Proses
            </Button>
          </Box>
          <Box>
            <Box>
              {data.processTracking.map((e, i) => {
                return (
                  <Fragment key={i}>
                    <Typography variant="p" component="p">
                      {dateFormatter(e.date, 'd MMM')}
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
              {data.totalCount ? data.totalCount : '-'}
            </Typography>
            <Typography variant="h5" component="h5">
              Jumlah Harga Produk
            </Typography>
            <Typography variant="p" component="p">
              {moneyFormatter(data.totalPrice ? data.totalPrice : '-')}
            </Typography>
            <Typography variant="h5" component="h5">
              Biaya Ongkos Kirim
            </Typography>
            <Typography variant="p" component="p">
              {moneyFormatter(data.shippingInfo.price)}
            </Typography>
            <Typography variant="h5" component="h5">
              Jumlah Pembayaran
            </Typography>
            <Typography variant="p" component="p">
              {data.totalPrice && data.shippingInfo.price ? moneyFormatter(data.totalPrice + data.shippingInfo.price) : 'Rp. -'}
            </Typography>
          </Box>
        </Box>
      </Component>
      <DialogUpdateOrderProcess open={isOpenDialogUpdateProcess} onClose={() => setOpenDialogUpdateProcess(false)} data={data} />
      <DialogUpdateOrderPrice open={isOpenDialogUpdatePrice} onClose={() => setOpenDialogUpdatePrice(false)} data={data} />
      {(() => {
        return data.transactionInfo.image ? (
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
  );
}
