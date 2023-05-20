import { db } from 'config/firebase';
import OrderGrid from 'containers/templates/OrderGrid';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { defaultProductImage, orderProcess, orderType } from 'utils/other/EnvironmentValues';
import { MENU_OPEN, SET_ACTIVE } from 'utils/redux/action';
import PageRoot from './styled';

export default function OrderListPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const searchReducer = useSelector((state) => state.searchReducer);

  const [orders, setOrders] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isCompleteListener, setIsCompleteListener] = useState(false);

  useEffect(() => {
    setDataList(orders.filter((order) => (order.id ?? "").toLowerCase().includes(searchReducer.value?.toLowerCase())));
  }, [orders, searchReducer.value]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'order') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'order' });
    }

    const listenerOrders = onSnapshot(collection(db, 'orders'), async (snapshot) => {
      setOrders(
        true
          ? Array.from(Array(10).keys()).map(() => ({}))
          : (
              await Promise.all(
                snapshot.docs.map(async (document) => {
                  const data = document.data();
                  const productSnapshot = await getDoc(doc(db, 'products', data.orderInfo[0].productId));
                  const product = productSnapshot.exists()
                    ? { name: productSnapshot.data().name, photo: productSnapshot.data().images[0] }
                    : {
                        name: 'Produk',
                        photo: defaultProductImage
                      };

                  return {
                    id: document.id,
                    customerId: data.customerId,
                    dateCreated: data.dateCreated,
                    processTracking: data.processTracking,
                    transactionInfo: data.transactionInfo,
                    productName: product.name,
                    productPhotoUrl: product.photo,
                    color: data.orderInfo[0].color,
                    size: data.orderInfo[0].size,
                    count: data.orderInfo[0].count,
                    price: data.orderInfo[0].price,
                    totalCount: data.orderInfo.map((e) => e.count).reduce((a, b) => a + b, 0),
                    totalPrice: data.orderInfo.map((e) => e.price).reduce((a, b) => a + b, 0)
                  };
                })
              )
            ).filter((order) => !order.processTracking.map((process) => process.name).includes(orderProcess.orderFinished))
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
        type={orderType.order}
        isCompleteListener={isCompleteListener}
        isEmptySearch={orders.length > 0 && dataList.length === 0}
      />
    </PageRoot>
  );
}
