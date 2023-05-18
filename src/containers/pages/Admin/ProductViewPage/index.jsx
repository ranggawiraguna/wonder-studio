import { useTheme } from '@emotion/react';
import { Backdrop, Box, Button, Rating, Typography, useMediaQuery } from '@mui/material';
import AlertToast from 'components/elements/AlertToast';
import EmptyContent from 'components/elements/EmptyContent';
import FieldGroupView from 'components/elements/FieldGroupView';
import { db, storage } from 'config/firebase';
import { deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import { deleteObject, ref } from 'firebase/storage';
import { Fragment, useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
import { defaultProductImage } from 'utils/other/EnvironmentValues';
import { MENU_OPEN } from 'utils/redux/action';
import PageRoot from './styled';

export default function ProductViewPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const theme = useTheme();
  const matchOnlyXs = useMediaQuery(theme.breakpoints.only('xs'));
  const params = useParams();
  const navigate = useNavigate();

  const [isDeleteProcess, setIsDeleteProcess] = useState(false);

  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const showAlertToast = (type, text) =>
    setAlertDescription({
      ...alertDescription,
      isOpen: true,
      type: type,
      text: text
    });

  const [product, setProduct] = useState({
    id: '',
    category: '',
    colors: [],
    description: '',
    name: '',
    images: ['', '', ''],
    price: 0,
    rating: 5,
    sizes: [],
    sold: 0,
    stocks: []
  });

  const [imageBackdrop, setImageBackdrop] = useState('');
  const [openImageBackdrop, setOpenImageBackdrop] = useState(false);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'product') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'product' });
    }

    const listenerProduct = onSnapshot(doc(db, 'products', params.id), (snapshot) => {
      if (snapshot.exists()) {
        setProduct({
          id: snapshot.id,
          ...snapshot.data()
        });
      } else {
        setProduct(null);
      }
    });

    return () => {
      listenerProduct();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return product !== null ? (
    <Fragment>
      <PageRoot>
        <Box>
          <Typography variant="h3" component="h3">
            Data Produk
          </Typography>
          <Box>
            <Button variant="contained" onClick={() => navigate(`/admin/product/edit/${params.id}`)}>
              Edit {matchOnlyXs ? '' : 'Produk'}
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                if (!isDeleteProcess) {
                  setIsDeleteProcess(true);
                  deleteDoc(doc(db, 'products', params.id))
                    .catch(() => {
                      showAlertToast('warning', 'Terjadi kesalahan, gagal menghapus produk');
                      setIsDeleteProcess(false);
                    })
                    .then(() => {
                      for (let i = 0; i < 3; i++) {
                        deleteObject(ref(storage, `product-images/${params.id}-${i + 1}`)).catch(() => {});
                      }
                      navigate('/admin/product');
                      setIsDeleteProcess(false);
                    });
                }
              }}
            >
              Hapus {matchOnlyXs ? '' : 'Produk'}
            </Button>
          </Box>
        </Box>
        <Box>
          <Box>
            <FieldGroupView withFrame title="ID Produk" data={product.id} />
          </Box>
          <Box>
            <Typography variant="h4" component="h4">
              Foto Produk
            </Typography>
            <Box>
              {product.images != null ? (
                product.images.map((_, __) => (
                  <Box
                    onClick={() => {
                      document.body.style = 'overflow: hidden';
                      setImageBackdrop(_);
                      setOpenImageBackdrop(true);
                    }}
                    sx={{
                      backgroundImage: `url(${_ ? _ : defaultProductImage})`,
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                ))
              ) : (
                <></>
              )}
            </Box>
            <Box>
              <Typography variant="h4" component="h4">
                Penilaian
              </Typography>
              <Box>
                <Rating
                  name="read-only"
                  value={product.rating}
                  precision={product.rating - Math.floor(product.rating) ? 0.1 : 1}
                  size={'small'}
                  readOnly
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <FieldGroupView withFrame title="ID Produk" data={product.id} />
            <FieldGroupView withFrame title="Nama Produk" data={product.name} sx={{ marginBottom: '30px' }} />
            <FieldGroupView withFrame title="Deskripsi" data={product.description} sx={{ marginBottom: '30px' }} />
            <FieldGroupView withFrame title="Satuan Jumlah" data={product.uom} sx={{ marginBottom: '30px' }} />
            <FieldGroupView withFrame title="Minimal Order" data={product.minimalOrder} sx={{ marginBottom: '30px' }} />
            <FieldGroupView withFrame title="Harga" data={product.price} sx={{ marginBottom: '30px' }} />
            <FieldGroupView withFrame type="color" title="Warna" data={product.colors} sx={{ marginBottom: '30px' }} />
            <Box>
              {(product.models ?? []).length > 0 ? (
                <FieldGroupView withFrame type="model" title="Model" data={product.models} sx={{ marginBottom: '30px' }} />
              ) : (
                <></>
              )}
              {(product.models ?? []).length > 0 ? (
                <FieldGroupView withFrame type="size" title="Ukuran" data={product.sizes} sx={{ marginBottom: '30px' }} />
              ) : (
                <></>
              )}
            </Box>
            <FieldGroupView withFrame title="Terjual" data={product.sold} />
          </Box>
        </Box>
      </PageRoot>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, padding: '2vw' }}
        open={openImageBackdrop}
        onClick={() => {
          document.body.style = '';
          setOpenImageBackdrop(false);
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundImage: `url(${imageBackdrop})`,
            backgroundPosition: 'center',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat'
          }}
        />
      </Backdrop>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  ) : (
    <EmptyContent />
  );
}
