import { db } from 'config/firebase';
import OrderView from 'containers/templates/OrderView';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { defaultProductImage, orderType } from 'utils/other/EnvironmentValues';
import PageRoot from './styled';

export default function OrderViewPage() {
  const params = useParams();

  const [order, setOrder] = useState({
    id: params.id,
    type: orderType.order,
    dateCreated: null,
    dateFinished: null,
    customerId: '',
    customerName: '',
    textNotes: '',
    destinationAddress: '',
    paymentMethod: '',
    orderInfo: [],
    shippingInfo: {
      name: '',
      price: 0
    },
    transactionInfo: {
      image: '',
      status: false
    },
    processTracking: [],
    otherInfo: [],
    totalCount: 0,
    totalPrice: 0
  });

  useEffect(() => {
    const listenerOrder = onSnapshot(doc(db, 'orders', params.id), async (snapshot) => {
      const customerSnapshot = await getDoc(doc(db, 'customers', snapshot.data().customerId));
      setOrder({
        id: snapshot.id,
        customerName: customerSnapshot.exists() ? customerSnapshot.data().fullname : '',
        ...snapshot.data(),
        otherInfo: await Promise.all(
          snapshot.data().orderInfo.map(async (element) => {
            const productSnapshot = await getDoc(doc(db, 'products', element.productId));
            const product = productSnapshot.exists()
              ? { name: productSnapshot.data().name, photo: productSnapshot.data().images[0] }
              : {
                  name: 'Produk',
                  photo: defaultProductImage
                };

            return {
              type: snapshot.data().type,
              productName: product.name,
              productPhotoUrl: product.photo,
              color: element.color,
              size: element.size,
              count: element.count,
              price: element.price
            };
          })
        ),
        totalCount: snapshot
          .data()
          .orderInfo.map((e) => e.count)
          .reduce((a, b) => a + b, 0),
        totalPrice: snapshot
          .data()
          .orderInfo.map((e) => e.price)
          .reduce((a, b) => a + b, 0)
      });
    });

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
