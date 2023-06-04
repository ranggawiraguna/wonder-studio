import { db } from 'config/firebase';
import OrderView from 'containers/templates/OrderView';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import PageRoot from './styled';
import { useSelector } from 'react-redux';

export default function OrderViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const accountReducer = useSelector((state) => state.accountReducer);

  const [order, setOrder] = useState({});

  useEffect(() => {
    const listenerOrder = onSnapshot(doc(db, 'orders', params.id), async (snapshot) =>
      setOrder({
        id: snapshot.id,
        ...snapshot.data()
      })
    );

    return () => {
      listenerOrder();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (order.customerId && order.customerId !== accountReducer.id) navigate('/error');

  return order.customerId || order.customerId === accountReducer.id ? (
    <PageRoot>
      <OrderView data={order} />
    </PageRoot>
  ) : (
    <></>
  );
}
