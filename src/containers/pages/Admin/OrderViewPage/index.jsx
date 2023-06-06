import { db } from 'config/firebase';
import OrderView from 'containers/templates/OrderView';
import { doc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PageRoot from './styled';

export default function OrderViewPage() {
  const params = useParams();

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

  return (
    <PageRoot>
      <OrderView data={order} />
    </PageRoot>
  );
}
