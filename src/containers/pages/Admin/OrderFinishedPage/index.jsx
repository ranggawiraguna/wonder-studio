import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AccordionDisplay from 'containers/templates/AccordionDisplay';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import PageRoot from './styled';
import { orderProcess, reverseTimelineValue, timeline, timelineValues } from 'utils/other/EnvironmentValues';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from 'config/firebase';
import { dateConverter, dateFormatter } from 'utils/other/Services';
import ChartSingle from 'components/elements/ChartSingle';

const tableHeadContent = ['Tanggal', 'Waktu', 'No. Pesanan', 'Username Pelanggan', 'Jumlah Produk'];

export default function OrderFinishedPage() {
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
        count = data.filter(
          (element) =>
            dateConverter(element.dateCreated) >= new Date(currentDate.getFullYear() - 9 + index, 0) &&
            dateConverter(element.dateCreated) < new Date(currentDate.getFullYear() - 9 + index + 1, 0)
        ).length;
      } else if (timelineValue.length === 12) {
        count = data.filter(
          (element) =>
            dateConverter(element.dateCreated) >= new Date(currentDate.getFullYear(), index) &&
            dateConverter(element.dateCreated) < new Date(currentDate.getFullYear(), index + 1)
        ).length;
      } else if (timelineValue.length === 7) {
        count = data.filter(
          (element) =>
            dateConverter(element.dateCreated) >=
              new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index) &&
            dateConverter(element.dateCreated) <
              new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 6 + index + 1)
        ).length;
      }

      return count;
    });
  };

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'order-finished') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'order-finished' });
    }

    const listenerOrders = onSnapshot(collection(db, 'orders'), async (snapshot) =>
      setOrders(
        await Promise.all(
          snapshot.docs
            .filter((document) =>
              document
                .data()
                .processTracking.map((process) => process.name)
                .includes(orderProcess.orderFinished)
            )
            .map(async (document) => {
              const customerSnapshot = await getDoc(doc(db, 'customers', document.data().customerId));

              return {
                id: document.id,
                customerUsername: customerSnapshot.exists() ? customerSnapshot.data().username : '',
                dateCreated: document.data().dateCreated,
                processTracking: document.data().processTracking,
                amount: document.data().products.reduce((a, b) => a + b.count, 0)
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
        title="Pemesanan Selesai"
        data={orders}
        timelineName={timelineName}
        setTimelineName={setTimelineName}
        timelineValue={timelineValue}
        setTimelineValue={setTimelineValue}
        ChartView={() => {
          return (
            <ChartSingle
              id="ChartPemesananSelesai"
              type="line"
              label={timelineValue}
              data={getDataByTimeline(orders)}
              stroke="smooth"
              color="#B11900"
            />
          );
        }}
        TableView={({ rows }) => {
          rows = rows.map((row) => ({
            date: dateFormatter(row.dateCreated, 'd MMMM yyyy'),
            time: dateFormatter(row.dateCreated, 'HH:mm'),
            id: row.id,
            customerUsername: row.customerUsername,
            amount: row.amount
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
