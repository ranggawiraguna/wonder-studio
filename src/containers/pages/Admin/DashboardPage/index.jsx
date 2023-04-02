import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import { useEffect, useState } from 'react';
import DashboardGrid from 'containers/templates/DashboardGrid';
import IconBag from 'assets/images/icon/DashboardCardBag.png';
import IconCoin from 'assets/images/icon/DashboardCardCoin.png';
import PageRoot from './styled';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'config/firebase';
import { orderProcess, orderType } from 'utils/other/EnvironmentValues';
import { dateConverter } from 'utils/other/Services';

export default function StoreDashboard() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'dashboard') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'dashboard' });
    }

    const listenerOrders = onSnapshot(collection(db, 'orders'), (snapshot) =>
      setOrders(
        snapshot.docs.map((document) => ({
          dateCreated: document.data().dateCreated,
          type: document.data().type,
          processTracking: document.data().processTracking,
          transactionInfo: document.data().transactionInfo,
          orderInfo: document.data().orderInfo
        }))
      )
    );

    const listenerProducts = onSnapshot(query(collection(db, 'products'), orderBy('sold', 'desc'), limit(5)), (snapshot) =>
      setProducts(
        snapshot.docs.map((document) => ({
          name: document.data().name,
          amount: document.data().sold
        }))
      )
    );

    return () => {
      listenerOrders();
      listenerProducts();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageRoot>
      <DashboardGrid
        sectionName="admin"
        itemValues={[
          {
            title: 'Transaksi-Berjalan',
            note: 'Total-Transaksi',
            path: 'transaction',
            data: orders.filter((order) => {
              const processList = order.processTracking.map((tracking) => tracking.name);
              return order.transactionInfo.status === true && !processList.includes(orderProcess.orderFinished);
            }).length
          },
          {
            title: 'Transaksi-Tertunda',
            note: 'Total-Transaksi',
            path: 'transaction',
            data: orders.filter((order) => {
              const processList = order.processTracking.map((tracking) => tracking.name);
              return order.transactionInfo.status === false && !processList.includes(orderProcess.orderFinished);
            }).length
          },
          {
            title: 'Pemesanan Selesai',
            colors: ['#B11900', '#6DAFA7', '#359AFF'],
            notes: ['Produk', 'Pre-Order', 'Kostumisasi'],
            path: 'order-finished',
            datas: [
              orders.filter(
                (order) =>
                  order.type === orderType.order &&
                  order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished)
              ),
              orders.filter(
                (order) =>
                  order.type === orderType.preOrder &&
                  order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished)
              ),
              orders.filter(
                (order) =>
                  order.type === orderType.customization &&
                  order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished)
              )
            ],
            reducer: (dataFilter) => dataFilter.length
          },
          {
            title: 'Total-Pemesanan',
            icon: IconBag,
            unit: 'Produk',
            data: orders
              .filter(
                (order) =>
                  dateConverter(order.dateCreated) >= new Date(new Date().setDate(new Date().getDate() - 30)) &&
                  order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished)
              )
              .reduce((value, order) => {
                switch (order.type) {
                  case orderType.order:
                    return value + order.orderInfo.reduce((a, b) => a + b.count, 0);

                  case orderType.preOrder:
                    return value + order.orderInfo.map((e) => e.sizes.reduce((a, b) => a + b.count, 0)).reduce((a, b) => a + b, 0);

                  case orderType.customization:
                    return value + order.orderInfo.sizes.reduce((a, b) => a + b.count, 0);

                  default:
                    return value + 0;
                }
              }, 0)
          },
          {
            title: 'Total-Pendapatan',
            icon: IconCoin,
            unit: 'Rupiah',
            data: orders
              .filter(
                (order) =>
                dateConverter(order.dateCreated) >= new Date(new Date().setDate(new Date().getDate() - 30)) &&
                  order.transactionInfo.status === true
              )
              .reduce((value, order) => {
                switch (order.type) {
                  case orderType.order:
                    return value + order.orderInfo.reduce((a, b) => a + b.price, 0);

                  case orderType.preOrder:
                    return value + order.orderInfo.reduce((a, b) => a + b.price, 0);

                  case orderType.customization:
                    return value + order.orderInfo.price;

                  default:
                    return 0;
                }
              }, 0)
          },
          {
            title: 'Produk Terlaris',
            path: 'popular-product',
            data: products
          },
          {
            title: 'Pendapatan Penjualan',
            color: '#FF583C',
            path: 'revenue',
            data: orders.filter((order) => order.transactionInfo.status === true),
            reducer: (dataFilter) => {
              let totalPrice = 0;

              dataFilter.forEach((data) => {
                switch (data.type) {
                  case orderType.order:
                    totalPrice += data.orderInfo.reduce((a, b) => a + b.price, 0);
                    break;

                  case orderType.preOrder:
                    totalPrice += data.orderInfo.reduce((a, b) => a + b.price, 0);
                    break;

                  case orderType.customization:
                    totalPrice += data.orderInfo.price;
                    break;

                  default:
                    totalPrice += 0;
                    break;
                }
              });

              return totalPrice;
            }
          }
        ]}
      />
    </PageRoot>
  );
}
