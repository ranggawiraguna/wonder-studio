import { Box, CardMedia, TableCell, TableRow, Typography } from '@mui/material';
import TableDisplay from 'containers/templates/TableDisplay';
import IconStatusDelayed from 'assets/images/icon/TransactionStatusDelayed.svg';
import IconStatusRunning from 'assets/images/icon/TransactionStatusRunning.svg';
import { Fragment, useEffect, useState } from 'react';
import { orderProcess, tableDisplayType } from 'utils/other/EnvironmentValues';
import PageRoot from './styled';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from 'config/firebase';
import { moneyFormatter } from 'utils/other/Services';

const tableHeadContent = ['Foto', 'Username & Nama Pelanggan', 'No. Pesanan', 'Jumlah Pembayaran', 'Status'];
const tableAlignContent = ['center', 'left', 'left', 'left', 'center'];

export default function TransactionPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'transaction') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'transaction' });
    }

    const listenerOrders = onSnapshot(collection(db, 'orders'), async (snapshot) =>
      setOrders(
        await Promise.all(
          snapshot.docs
            .filter((document) => {
              const processList = document.data().processTracking.map((tracking) => tracking.name);
              return !processList.includes(orderProcess.orderFinished) && !processList.includes(orderProcess.orderCanceled);
            })
            .map(async (document) => {
              const customerSnapshot = await getDoc(doc(db, 'customers', document.data().customerId));
              return {
                id: document.id,
                customerUsername: customerSnapshot.exists() ? customerSnapshot.data().username : '',
                customerProfile: customerSnapshot.exists() ? customerSnapshot.data().photoUrl : '',
                ...document.data()
              };
            })
        )
      )
    );

    return () => {
      listenerOrders();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageRoot>
      <TableDisplay
        title="Daftar Transaksi"
        tableContentType={tableDisplayType.card}
        tableAlignContent={tableAlignContent}
        tableHeadContent={tableHeadContent}
        tableBodyContent={(() => {
          return orders.map((order, index) => (
            <Fragment key={index}>
              <TableRow sx={{ height: index === 0 ? 20 : 8 }} />
              <TableRow className="card">
                <TableCell align={tableAlignContent[0]} sx={{ width: '74px', padding: '7px' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      backgroundColor: 'lightgrey',
                      borderRadius: '5px',
                      backgroundImage: `url(${order.customerProfile})`,
                      backgroundPosition:'center',
                      backgroundSize:'cover',
                      backgroundRepeat:'no-repeat'
                    }}
                  />
                </TableCell>
                <TableCell align={tableAlignContent[1]}>
                  <Typography variant="h4" component="h4">
                    {order.customerName}
                  </Typography>
                  <Typography variant="h5" component="h5">
                    {order.customerUsername}
                  </Typography>
                </TableCell>
                <TableCell align={tableAlignContent[2]}>
                  <Typography variant="h5" component="h5">
                    {order.id}
                  </Typography>
                </TableCell>
                <TableCell align={tableAlignContent[3]}>
                  <Typography variant="h5" component="h5">
                    {moneyFormatter(order.products.reduce((a, b) => a + b.price, 0) + (order.shippingPrice ?? 0))}
                  </Typography>
                </TableCell>
                <TableCell align={tableAlignContent[4]}>
                  <CardMedia
                    component="img"
                    className="data-status"
                    src={order.processTracking.includes(orderProcess.paymentConfirmed) ? IconStatusRunning : IconStatusDelayed}
                  />
                </TableCell>
              </TableRow>
              <TableRow sx={{ height: index === orders.length - 1 ? 20 : 8 }} />
            </Fragment>
          ));
        })()}
      />
    </PageRoot>
  );
}
