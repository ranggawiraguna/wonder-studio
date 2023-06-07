import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN } from 'utils/redux/action';
import { useEffect, useState } from 'react';
import DashboardGrid from 'containers/templates/DashboardGrid';
import IconBag from 'assets/images/icon/DashboardCardBag.png';
import IconCoin from 'assets/images/icon/DashboardCardCoin.png';
import PageRoot from './styled';
import { collection, limit, onSnapshot, query } from 'firebase/firestore';
import { db } from 'config/firebase';
import { orderProcess } from 'utils/other/EnvironmentValues';
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
          id: document.data().id,
          ...document.data()
        }))
      )
    );

    const listenerProducts = onSnapshot(query(collection(db, 'products'), limit(5)), (snapshot) =>
      setProducts(
        snapshot.docs.map((document) => ({
          id: document.data().id,
          ...document.data(),
          sold: document.data().sold ?? 1
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
              return (
                processList.includes(orderProcess.paymentConfirmed) &&
                !(processList.includes(orderProcess.orderFinished) || processList.includes(orderProcess.orderCanceled))
              );
            }).length
          },
          {
            title: 'Transaksi-Tertunda',
            note: 'Total-Transaksi',
            path: 'transaction',
            data: orders.filter((order) => {
              const processList = order.processTracking.map((tracking) => tracking.name);
              return (
                !processList.includes(orderProcess.paymentConfirmed) &&
                !(processList.includes(orderProcess.orderFinished) || processList.includes(orderProcess.orderCanceled))
              );
            }).length
          },
          {
            title: 'Pemesanan Selesai',
            color: '#B11900',
            path: 'order-finished',
            data: orders.filter((order) => order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished)),
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
              .reduce((a, b) => a + b.products.length, 0)
          },
          {
            title: 'Total-Pendapatan',
            icon: IconCoin,
            unit: 'Rupiah',
            data: orders
              .filter((order) => dateConverter(order.dateCreated) >= new Date(new Date().setDate(new Date().getDate() - 30)))
              .reduce((a, b) => a + b.products.reduce((a, b) => a + b.price, 0) + (b.shippingPrice ?? 0), 0)
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
            data: orders,
            reducer: (dataFilter) =>
              dataFilter.reduce((a, b) => a + b.products.reduce((a, b) => a + b.price, 0) + (dataFilter.shippingPrice ?? 0), 0)
          }
        ]}
      />
    </PageRoot>
  );
}
