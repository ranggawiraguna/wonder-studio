import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import AccordionDisplay from 'containers/templates/AccordionDisplay';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import PageRoot from './styled';
import ChartMultiple from 'components/elements/ChartMultiple';
import { orderProcess, orderType, reverseTimelineValue, timeline, timelineValues } from 'utils/other/EnvironmentValues';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from 'config/firebase';
import { dateConverter, dateFormatter } from 'utils/other/Services';

const tableHeadContent = ['Tanggal', 'Waktu', 'No. Pesanan', 'Pelanggan', 'Jumlah Produk'];

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
            dateConverter(element.dateCreatedelement.dateCreated) < new Date(currentDate.getFullYear() - 9 + index + 1, 0)
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

    const listenerOrders = onSnapshot(collection(db, 'orders'), (snapshot) =>
      setOrders(
        snapshot.docs
          .filter((document) =>
            document
              .data()
              .processTracking.map((process) => process.name)
              .includes(orderProcess.orderFinished)
          )
          .map((document) => ({
            id: document.id,
            customerId: document.data().customerId,
            dateCreated: document.data().dateCreated,
            type: document.data().type,
            processTracking: document.data().processTracking,
            amount: (() => {
              switch (document.data().type) {
                case orderType.order:
                  return document.data().orderInfo.reduce((a, b) => a + b.count, 0);

                case orderType.preOrder:
                  return document
                    .data()
                    .orderInfo.map((e) => e.sizes.reduce((a, b) => a + b.count, 0))
                    .reduce((a, b) => a + b, 0);

                case orderType.customization:
                  return document.data().orderInfo.sizes.reduce((a, b) => a + b.count, 0);

                default:
                  return 0;
              }
            })()
          }))
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
            <ChartMultiple
              id="ChartPemesananSelesai"
              type="line"
              label={timelineValue}
              datas={[
                {
                  name: 'Produk',
                  data: getDataByTimeline(orders.filter((order) => order.type === orderType.order))
                },
                {
                  name: 'Pre-Order',
                  data: getDataByTimeline(orders.filter((order) => order.type === orderType.preOrder))
                },
                {
                  name: 'Kutomisasi',
                  data: getDataByTimeline(orders.filter((order) => order.type === orderType.preOrder))
                }
              ]}
              notes={['Produk', 'Pre-Order', 'Kostumisasi']}
              colors={['#B11900', '#6DAFA7', '#359AFF']}
            />
          );
        }}
        TableView={({ rows }) => {
          rows = rows.map((row) => ({
            date: dateFormatter(row.dateCreated, 'd MMMM yyyy'),
            time: dateFormatter(row.dateCreated, 'HH:mm'),
            id: row.id,
            customerId: row.customerId,
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
