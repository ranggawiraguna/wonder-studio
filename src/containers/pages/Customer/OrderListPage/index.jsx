import { db } from 'config/firebase';
import OrderGrid from 'containers/templates/OrderGrid';
import { collection, onSnapshot } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { orderProcess } from 'utils/other/EnvironmentValues';
import { MENU_OPEN, SET_ACTIVE } from 'utils/redux/action';
import PageRoot from './styled';

export default function OrderListPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const accountReducer = useSelector((state) => state.accountReducer);
  const searchReducer = useSelector((state) => state.searchReducer);

  const [orders, setOrders] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isCompleteListener, setIsCompleteListener] = useState(false);

  useEffect(() => {
    setDataList(orders.filter((order) => (order.id ?? '').toLowerCase().includes(searchReducer.value?.toLowerCase())));
  }, [orders, searchReducer.value]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'order') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'order' });
    }

    const listenerOrders = onSnapshot(collection(db, 'orders'), async (snapshot) => {
      setOrders(
        (await Promise.all(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))).filter(
          (order) =>
            order.customerId === accountReducer.id &&
            !(order.processTracking.map((e) => e.name).includes(orderProcess.orderFinished) || order.processTracking.map((e) => e.name).includes(orderProcess.orderCanceled))
        )
      );
      setIsCompleteListener(true);
    });

    dispatch({ type: SET_ACTIVE, status: true });

    return () => {
      listenerOrders();
      dispatch({ type: SET_ACTIVE, status: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageRoot>
      <OrderGrid
        data={dataList}
        isAdmin={false}
        isCompleteListener={isCompleteListener}
        isEmptySearch={orders.length > 0 && dataList.length === 0}
      />
    </PageRoot>
  );
}
