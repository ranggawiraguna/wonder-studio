import { Box, Button, CardMedia, Typography } from '@mui/material';
import Component from './styled';
import IconOrderStatus from 'assets/images/icon/OrderStatusInfo.svg';
import { orderProcessDetail } from 'utils/other/EnvironmentValues';
import { useNavigate } from 'react-router';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';
import { Fragment, useState } from 'react';
import DialogUpdateOrderProcess from 'components/views/DialogActionOrder/UpdateOrderProcess';
import IllustrationEmptyContent from 'assets/images/illustration/EmptyContent.svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/firebase';
import OrderItem from 'components/elements/OrderItem';

export default function OrderGrid({ data, type, isAdmin = true, isCompleteListener, isEmptySearch, showLastProcess = true }) {
  const navigate = useNavigate();

  const [selectedData, setSelectedData] = useState({
    id: '',
    type: type,
    customerId: '',
    customerName: '',
    totalPrice: 0,
    processTracking: [],
    transactionInfo: {
      image: '',
      status: false
    }
  });

  const [isOpenDialogUpdateProcess, setOpenDialogUpdateProcess] = useState(false);

  return data.length > 0 ? (
    <Fragment>
      <Component>
        {(() => {
          return data.map((element, index) => (
            <Box key={index} data={element}>
              <Box gridTemplateAreas={`"A . B"`} gridTemplateColumns={'1fr 10px auto'}>
                <Typography gridArea="A" variant="h4" component="h4">
                  No Pesanan : {element.id.toString().toUpperCase()}
                </Typography>
                <Typography gridArea="B" variant="p" component="p" marginBottom="auto">
                  {dateFormatter(element.dateCreated, 'eeee, d MMMM yyyy')}
                </Typography>
              </Box>
              <OrderItem data={element.products[0]} />
              <Box>
                <Box />
                <Box />
                <Box />
              </Box>
              <hr />
              <Box gridTemplateAreas={`"A . B C"`} gridTemplateColumns={'auto 1fr auto auto'}>
                <Typography gridArea="A" variant="p" component="p">
                  Jumlah Produk : {element.products ? element.products.reduce((a, b) => a + b.count, 0) : 0}
                </Typography>
                <Typography gridArea="B" variant="p" component="p">
                  Total Pesanan :
                </Typography>
                <Typography gridArea="C" variant="p" component="p">
                  {moneyFormatter(element.products.reduce((a, b) => a + b.price, 0))}
                </Typography>
              </Box>
              <hr style={showLastProcess ? {} : { display: 'none' }} />
              <Box gridTemplateAreas={`"A B ."`} gridTemplateColumns={'auto auto 1fr'} style={showLastProcess ? {} : { display: 'none' }}>
                <CardMedia component="img" src={IconOrderStatus} />
                <Typography gridArea="B" variant="p" component="p">
                  {orderProcessDetail[element.processTracking[element.processTracking.length - 1].name].description}
                </Typography>
              </Box>
              <hr />
              <Box
                gridTemplateAreas={{ xs: `". A B ."`, sm: `". A B"` }}
                gridTemplateColumns={{ xs: '1fr auto auto 1fr', sm: '1fr auto auto' }}
              >
                <Box gridArea="A">
                  <Button
                    variant="contained"
                    sx={isAdmin ? {} : { display: 'none' }}
                    onClick={async () => {
                      const customerSnapshot = await getDoc(doc(db, 'customers', element.customerId));
                      setSelectedData({
                        id: element.id,
                        type: type,
                        customerId: element.customerId,
                        customerName: customerSnapshot.exists() ? customerSnapshot.data().fullname : '',
                        totalPrice: element.totalPrice,
                        processTracking: element.processTracking,
                        transactionInfo: element.transactionInfo
                      });
                      setOpenDialogUpdateProcess(true);
                    }}
                  >
                    Edit Proses
                  </Button>
                </Box>
                <Box gridArea="B">
                  <Button variant="contained" onClick={() => navigate(`./view/${element.id}`)}>
                    Lihat Detail
                  </Button>
                </Box>
              </Box>
            </Box>
          ));
        })()}
      </Component>
      <DialogUpdateOrderProcess open={isOpenDialogUpdateProcess} onClose={() => setOpenDialogUpdateProcess(false)} data={selectedData} />
    </Fragment>
  ) : isCompleteListener && !isEmptySearch ? (
    <Box
      sx={{
        display: 'flex',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        sx={{
          width: '60%',
          height: '40%',
          backgroundImage: `url(${IllustrationEmptyContent})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'contain',
          backgroundPosition: 'center'
        }}
      />
    </Box>
  ) : (
    <></>
  );
}
