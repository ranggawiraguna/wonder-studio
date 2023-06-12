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
import DialogUpdateDeliveryPrice from 'components/views/DialogActionOrder/UpdateDeliveryPrice';
import AlertToast from 'components/elements/AlertToast';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from 'config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import DialogUpdateRating from 'components/views/DialogActionOrder/UpdateRating';

export default function OrderView({ data }) {
  const accountReducer = useSelector((state) => state.accountReducer);

  const [isOpenDialogUpdateProcess, setOpenDialogUpdateProcess] = useState(false);
  const [isOpenDialogUpdateRating, setOpenDialogUpdateRating] = useState(false);
  const [isOpenDialogUpdateDeliveryPrice, setOpenDialogUpdateDeliveryPrice] = useState(false);
  const [isOpenBackdropTransactionImage, setIsOpenBackdropTransactionImage] = useState(false);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const handleUploadProofOfPayment = async (_) => {
    if (_.target?.files?.[0]) {
      let imageUrl;
      try {
        imageUrl = await getDownloadURL((await uploadBytes(ref(storage, `/order-payments/${data.id}`), _.target?.files?.[0])).ref);
      } catch {
        showAlertToast('warning', 'Terjadi kesalahan, silahkan coba lagi');
      }

      if (imageUrl) {
        updateDoc(doc(db, 'orders', data.id), {
          transactionInfo: {
            ...data.transactionInfo,
            image: imageUrl,
            date: new Date()
          }
        })
          .catch(() => {
            showAlertToast('warning', 'Terjadi kesalahan, silahkan coba lagi');
            deleteObject(ref(storage, `/order-payments/${data.id}`));
          })
          .then(() => {
            showAlertToast('success', 'Berhasil mengupload bukti pembayaran');
          });
      }
    }
  };

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const getOptionalButtonAction = (processName) => {
    switch (processName) {
      case orderProcess.waitingPayment:
        return (
          <>
            {data.processTracking[data.processTracking.length - 1].name === orderProcess.waitingPayment &&
            accountReducer.role === 'customer' ? (
              <Box sx={{ border: '2px solid grey', borderRadius: 1, marginTop: 1, padding: 1 }}>
                <Typography variant="h5" component="h5" sx={{ fontWeight: 'bold' }}>
                  Bank Central Asia (BCA)
                </Typography>
                <Typography variant="h5" component="h5">
                  Muhammad Rifqi Ramadhan
                </Typography>
                <Typography variant="h5" component="h5">
                  4061565889
                </Typography>
              </Box>
            ) : (
              <></>
            )}
            <Typography variant="p" component="p">
              Status Pembayaran :&nbsp; {data.transactionInfo?.image ? 'Sudah' : 'Belum'} di upload
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {accountReducer.role === 'customer' ? (
                <>
                  <input hidden id="file-attachment" accept="image/*" type="file" multiple onChange={handleUploadProofOfPayment} />
                  <label htmlFor="file-attachment">
                    <Button component="span" variant="contained" className={'active'}>
                      Upload
                    </Button>
                  </label>
                </>
              ) : (
                <></>
              )}
              <Button
                variant="contained"
                className={data.transactionInfo?.image ? 'active' : 'inactive'}
                onClick={
                  data.transactionInfo?.image
                    ? () => {
                        document.body.style = 'overflow: hidden';
                        setIsOpenBackdropTransactionImage(true);
                      }
                    : null
                }
              >
                Lihat
              </Button>
            </Box>
          </>
        );

      case orderProcess.orderFinished:
        return (
          <>
            {accountReducer.role === 'customer' && !data.haveRated ? (
              <Button variant="contained" className="active" sx={{ marginTop: 1 }} onClick={() => setOpenDialogUpdateRating(true)}>
                Berikan Penilaian
              </Button>
            ) : (
              <></>
            )}
          </>
        );

      default:
        return <></>;
    }
  };

  return Object.keys(data).length > 0 ? (
    <Fragment>
      <Component>
        <Box gridArea="A">
          <Box>
            <Typography variant="h2" component="h2">
              Detail Pesanan
            </Typography>
            <Button
              variant="contained"
              disabled={
                accountReducer.role === 'customer' ||
                (data.processTracking ?? []).map((_) => _.name).includes(orderProcess.paymentConfirmed) ||
                data.deliveryType === 'cod'
              }
              sx={{
                opacity:
                  accountReducer.role === 'customer' ||
                  (data.processTracking ?? []).map((_) => _.name).includes(orderProcess.paymentConfirmed) ||
                  data.deliveryType === 'cod'
                    ? 0
                    : 1
              }}
              onClick={
                accountReducer.role === 'customer' ||
                (data.processTracking ?? []).map((_) => _.name).includes(orderProcess.paymentConfirmed)
                  ? null
                  : () => setOpenDialogUpdateDeliveryPrice(true)
              }
            >
              Edit Biaya Pengiriman
            </Button>
          </Box>
          <Box>
            <FieldGroupView title="No. Pesanan" data={data.id} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView title="Nama Pelanggan" data={data.name} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView title="Nomor Telepon" data={data.phoneNumber} sx={{ marginBottom: '20px' }} withFrame />
            <FieldGroupView
              title="Tipe Pengiriman"
              data={data.deliveryType === 'cod' ? 'Ambil Pesanan Ke Toko' : 'Antar Ke Alamat Tujuan'}
              sx={{ marginBottom: '20px' }}
              withFrame
            />
            <FieldGroupView
              title="Alamat Tujuan"
              data={data.address}
              sx={{ marginBottom: '20px', ...(data.deliveryType === 'cod' ? { display: 'none' } : {}) }}
              withFrame
            />
            <FieldGroupView
              title="Tanggal Pesanan Dibuat"
              data={dateFormatter(data.dateCreated, 'eeee, d MMMM yyyy - HH:mm')}
              sx={{ marginBottom: '20px' }}
              withFrame
            />
            <FieldGroupView
              title="Tanggal Pesanan Selesai"
              data={dateFormatter(data.dateFinished, 'eeee, d MMMM yyyy - HH:mm')}
              sx={{ marginBottom: '30px', ...(data.dateFinished ? {} : { display: 'none' }) }}
              withFrame
            />
            {data.products?.map((product, index) => (
              <>
                <Typography variant="h4" component="h4" sx={{ color: '#666666', marginBottom: '10px', marginLeft: '2px' }}>
                  Daftar Produk
                </Typography>
                <OrderItem
                  key={index}
                  data={product}
                  sx={{
                    marginBottom: '10px',
                    paddingBottom: '10px'
                  }}
                />
              </>
            ))}
          </Box>
        </Box>
        <Box gridArea="B">
          <Box>
            <Typography variant="h2" component="h2">
              Proses Pesanan
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
                      {getOptionalButtonAction(e.name)}
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
            {data.deliveryType === 'cod' ? (
              <></>
            ) : (
              <>
                <Typography variant="h5" component="h5">
                  Jumlah Biaya Pengiriman
                </Typography>
                <Typography variant="p" component="p">
                  {moneyFormatter(data.shippingPrice ?? 0)}
                </Typography>
              </>
            )}
            <Typography variant="h5" component="h5">
              Jumlah Pembayaran
            </Typography>
            <Typography variant="p" component="p">
              {data.products ? moneyFormatter(data.products.reduce((a, b) => a + b.price, 0) + (data.shippingPrice ?? 0)) : 'Rp. -'}
            </Typography>
          </Box>
        </Box>
      </Component>
      <DialogUpdateOrderProcess
        showAlert={showAlertToast}
        open={isOpenDialogUpdateProcess}
        onClose={() => setOpenDialogUpdateProcess(false)}
        data={data}
      />
      <DialogUpdateDeliveryPrice
        showAlert={showAlertToast}
        open={isOpenDialogUpdateDeliveryPrice}
        onClose={() => setOpenDialogUpdateDeliveryPrice(false)}
        data={data}
      />
      <DialogUpdateRating open={isOpenDialogUpdateRating} onClose={() => setOpenDialogUpdateRating(false)} data={data} />
      {data.transactionInfo?.image ? (
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
              backgroundImage: `url(${data.transactionInfo?.image})`,
              backgroundPosition: 'center',
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat'
            }}
          />
        </Backdrop>
      ) : (
        <></>
      )}
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  ) : (
    <></>
  );
}
