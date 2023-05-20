import { Box, Button, CardMedia, Typography } from '@mui/material';
import Component from './styled';
import IconOrderStatus from 'assets/images/icon/OrderStatusInfo.svg';
import { orderProcessDetail, orderType } from 'utils/other/EnvironmentValues';
import { useNavigate } from 'react-router';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';
import { Fragment, useState } from 'react';
import DialogUpdateOrderProcess from 'components/views/DialogActionOrder/DialogUpdateOrderProcess';
import IllustrationEmptyContent from 'assets/images/illustration/EmptyContent.svg';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'config/firebase';

export default function OrderGrid({ data, type, isCompleteListener, isEmptySearch }) {
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
              <Box gridTemplateAreas={`"A . B"`} gridTemplateColumns={'auto 1fr auto'}>
                <Typography gridArea="A" variant="h4" component="h4">
                  No Pesanan : {element.id}
                </Typography>
                <Typography gridArea="B" variant="p" component="p">
                  {dateFormatter(element.dateCreated, 'eeee, d MMMM yyyy')}
                </Typography>
              </Box>
              <Box
                gridTemplateAreas={{
                  xs: `
                "A B B"
                "A C C"
                "A D D"
                "A E E"
                "F F F"
                `,
                  sm: `
                  "A B B"
                  "A C C"
                  "A D D"
                  "A E F"
                `
                }}
                gridTemplateColumns={'auto 1fr auto'}
              >
                <Box gridArea="A" sx={{ backgroundImage: `url(${element.productPhotoUrl})`, backgroundRepeat: 'no-repeat' }} />
                <Typography gridArea="B" variant="p" component="p">
                  {element.productName}
                </Typography>
                <Box gridArea="C">
                  <Typography variant="p" component="p">
                    Warna :
                  </Typography>
                  <Box sx={{ backgroundColor: element.color, border: '1px solid lightgrey' }} />
                </Box>
                <Box gridArea="D">
                  <Typography variant="p" component="p">
                    Ukuran :
                  </Typography>
                  {(() => {
                    return type === orderType.order ? (
                      <Box sx={{ backgroundColor: 'lightgrey' }}>
                        <Typography variant="p" component="p">
                          {element.size}
                        </Typography>
                      </Box>
                    ) : (
                      element.sizes.map((size, index) => (
                        <Box key={index} sx={{ backgroundColor: 'lightgrey' }}>
                          <Typography variant="p" component="p">
                            {size}
                          </Typography>
                        </Box>
                      ))
                    );
                  })()}
                </Box>
                <Typography gridArea="E" variant="p" component="p">
                  Jumlah : {element.count}
                </Typography>
                <Typography gridArea="F" variant="p" component="p">
                  {moneyFormatter(element.price ?? 0)}
                </Typography>
              </Box>
              <Box>
                <Box />
                <Box />
                <Box />
              </Box>
              <hr />
              <Box gridTemplateAreas={`"A . B C"`} gridTemplateColumns={'auto 1fr auto auto'}>
                <Typography gridArea="A" variant="p" component="p">
                  {element.totalCount} Produk
                </Typography>
                <Typography gridArea="B" variant="p" component="p">
                  Total Pesanan :
                </Typography>
                <Typography gridArea="C" variant="p" component="p">
                  {moneyFormatter(element.totalPrice ?? 0)}
                </Typography>
              </Box>
              <hr />
              <Box gridTemplateAreas={`"A B ."`} gridTemplateColumns={'auto auto 1fr'}>
                <CardMedia component="img" src={IconOrderStatus} />
                <Typography gridArea="B" variant="p" component="p">
                  {Object.values(orderProcessDetail)[Math.floor(Math.random() * Object.values(orderProcessDetail).length)].description}
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
          width: '80%',
          height: '60%',
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
