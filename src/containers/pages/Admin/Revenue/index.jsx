import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import ChartSingle from 'components/elements/ChartSingle';
import { db } from 'config/firebase';
import AccordionDisplay from 'containers/templates/AccordionDisplay';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderProcess, reverseTimelineValue, timeline, timelineValues } from 'utils/other/EnvironmentValues';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';
import { MENU_OPEN } from 'utils/redux/action';
import PageRoot from './styled';

const tableHeadContent = ['Tanggal', 'Waktu', 'No. Pesanan', 'Pelanggan', 'Jumlah Transaksi'];

export default function RevenuePage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [timelineName, setTimelineName] = useState(timeline[0].value);
  const [timelineValue, setTimelineValue] = useState(reverseTimelineValue(timelineValues[timeline[0].value], timeline[0].value));

  const [orders, setOrders] = useState([]);

  const getDataByTimeline = (data) => {
    return timelineValue.map((value, index) => {
      const currentDate = new Date();

      let count = 0;
      if (timelineValue.length === 10) {
        count = data
          .filter(
            (element) =>
              element.dateCreated.toDate() >= new Date(currentDate.getFullYear() - 9 + index, 0) &&
              element.dateCreated.toDate() < new Date(currentDate.getFullYear() - 9 + index + 1, 0)
          )
          .reduce((a, b) => a + b.products.reduce((a, b) => a + b.price, 0) + (b.shippingPrice ?? 0), 0);
      } else if (timelineValue.length === 12) {
        count = data
          .filter(
            (element) =>
              element.dateCreated.toDate() >= new Date(currentDate.getFullYear(), index) &&
              element.dateCreated.toDate() < new Date(currentDate.getFullYear(), index + 1)
          )
          .reduce((a, b) => a + b.products.reduce((a, b) => a + b.price, 0) + (b.shippingPrice ?? 0), 0);
      } else if (timelineValue.length === 7) {
        count = data
          .filter(
            (element) =>
              element.dateCreated.toDate() >=
                new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index) &&
              element.dateCreated.toDate() <
                new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index + 1)
          )
          .reduce((a, b) => a + b.products.reduce((a, b) => a + b.price, 0) + (b.shippingPrice ?? 0), 0);
      }

      return count;
    });
  };

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'revenue') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'revenue' });
    }
    const listenerOrders = onSnapshot(collection(db, 'orders'), async (snapshot) =>
      setOrders(
        await Promise.all(
          snapshot.docs
            .filter((document) => {
              const processList = document.data().processTracking.map((tracking) => tracking.name);
              return processList.includes(orderProcess.orderFinished) && processList.includes(orderProcess.paymentConfirmed);
            })
            .map(async (document) => {
              const customerSnapshot = await getDoc(doc(db, 'customers', document.data().customerId));

              return {
                id: document.id,
                customerUsername: customerSnapshot.exists() ? customerSnapshot.data().username : '',
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
      <AccordionDisplay
        title="Pendapatan Penjualan"
        data={orders}
        timelineName={timelineName}
        setTimelineName={setTimelineName}
        timelineValue={timelineValue}
        setTimelineValue={setTimelineValue}
        ChartView={() => {
          return (
            <ChartSingle
              id={`ChartPendapatanPenjualan`}
              type="line"
              label={timelineValue}
              data={getDataByTimeline(orders)}
              stroke="smooth"
              color="#FF583C"
            />
          );
        }}
        TableView={({ rows }) => {
          rows = rows.map((row) => ({
            date: dateFormatter(row.dateCreated, 'd MMMM yyyy'),
            time: dateFormatter(row.dateCreated, 'HH:mm'),
            id: row.id,
            customerId: row.customerId,
            price: moneyFormatter(row.products.reduce((a, b) => a + b.price, 0) + (row.shippingPrice ?? 0))
          }));
          return (
            <TableContainer className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    {(() => {
                      return tableHeadContent.map((content, index) => (
                        <TableCell key={index} align="left">
                          {content}
                        </TableCell>
                      ));
                    })()}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(() => {
                    return rows.map((row, index) => (
                      <TableRow key={index}>
                        {(() => Object.keys(row).map((key, index) => <TableCell key={index}>{row[key]}</TableCell>))()}
                      </TableRow>
                    ));
                  })()}
                  {(() => {
                    if (rows.length <= 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={tableHeadContent.length} align="center">
                            <Typography variant="p" component="p" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                              Data tidak tersedia pada tabel ini
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  })()}
                </TableBody>
              </Table>
            </TableContainer>
          );
        }}
      />
    </PageRoot>
  );
}
