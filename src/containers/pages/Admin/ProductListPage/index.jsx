import { Button, CardMedia, ClickAwayListener, TableCell, TableRow, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { Fragment, useEffect, useState } from 'react';
import { tableDisplayType } from 'utils/other/EnvironmentValues';
import IconOptiontDetail from 'assets/images/icon/ProductOptionDetail.svg';
import TableDisplay from 'containers/templates/TableDisplay';
import PageRoot from './styled';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN, SET_ACTIVE } from 'utils/redux/action';
import { useNavigate } from 'react-router';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db, storage } from 'config/firebase';
import { moneyFormatter } from 'utils/other/Services';
import AlertToast from 'components/elements/AlertToast';
import { deleteObject, ref } from 'firebase/storage';

const tableHeadContent = ['Foto', 'Id & Nama Produk', 'Stok', 'Harga', ''];
const tableAlignContent = ['center', 'left', 'left', 'left', 'right'];

export default function ProductListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const searchReducer = useSelector((state) => state.searchReducer);

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

  const [products, setProducts] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [isOpenOption, setIsOpenOption] = useState([]);

  useEffect(() => {
    setDataList(
      products.filter(
        (product) =>
          product.id.toLowerCase().includes(searchReducer.value.toLowerCase()) ||
          product.name.toLowerCase().includes(searchReducer.value.toLowerCase())
      )
    );
  }, [products, searchReducer.value]);

  useEffect(() => {
    setIsOpenOption(dataList.map(() => false));
  }, [dataList]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'product') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'product' });
    }

    const listenerProducts = onSnapshot(query(collection(db, 'products'), orderBy('name')), (snapshot) =>
      setProducts(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );

    dispatch({ type: SET_ACTIVE, status: true });

    return () => {
      listenerProducts();
      dispatch({ type: SET_ACTIVE, status: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageRoot>
        <TableDisplay
          title="Daftar Produk"
          withButtonHeader={true}
          buttonText="Tambah Produk"
          buttonAction={() => navigate(`/admin/product/add`)}
          tableContentType={tableDisplayType.card}
          tableAlignContent={tableAlignContent}
          tableHeadContent={tableHeadContent}
          tableBodyContent={(() => {
            if (dataList.length <= 0) {
              return <TableRow sx={{ height: 600 }} />;
            }

            return dataList.map((product, index) => (
              <Fragment key={index}>
                <TableRow sx={{ height: index === 0 ? 20 : 8 }} />
                <TableRow className={index !== dataList.length - 1 ? 'card' : 'card last'}>
                  <TableCell align={tableAlignContent[0]} sx={{ width: '74px', padding: '7px' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        backgroundColor: 'lightgrey',
                        borderRadius: '5px',
                        backgroundImage: `url(${product.images[0]})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  </TableCell>
                  <TableCell align={tableAlignContent[1]}>
                    <Typography variant="h4" component="h4">
                      {product.name}
                    </Typography>
                    <Typography variant="h5" component="h5">
                      ID : {product.id}
                    </Typography>
                  </TableCell>
                  <TableCell align={tableAlignContent[2]}>
                    <Typography variant="h5" component="h5" fontWeight="bold">
                      -
                    </Typography>
                  </TableCell>
                  <TableCell align={tableAlignContent[3]}>
                    <Typography variant="h5" component="h5" fontWeight="bold">
                      {product.price ? moneyFormatter(product.price) : '-'}
                    </Typography>
                  </TableCell>
                  <TableCell align={tableAlignContent[4]}>
                    <ClickAwayListener
                      mouseEvent="onMouseDown"
                      touchEvent="onTouchStart"
                      onClickAway={() => {
                        if (isOpenOption[index]) {
                          isOpenOption[index] = false;
                          setIsOpenOption(Array.from(isOpenOption));
                        }
                      }}
                    >
                      <Box>
                        <Button
                          type="Button"
                          onClick={() => {
                            isOpenOption[index] = !isOpenOption[index];
                            setIsOpenOption(Array.from(isOpenOption));
                          }}
                        >
                          <CardMedia component="img" src={IconOptiontDetail} />
                        </Button>
                        {(() => {
                          const closeClickaway = (callback) => {
                            callback();
                            isOpenOption[index] = !isOpenOption[index];
                            setIsOpenOption(Array.from(isOpenOption));
                          };

                          return isOpenOption[index] ? (
                            <Box>
                              <Button
                                onClick={() =>
                                  closeClickaway(() => {
                                    navigate(`/admin/product/view/${product.id}`);
                                  })
                                }
                              >
                                Lihat Detail
                              </Button>
                              <Button
                                onClick={() =>
                                  closeClickaway(() => {
                                    navigate(`/admin/product/edit/${product.id}`);
                                  })
                                }
                              >
                                Edit Produk
                              </Button>
                              <Button
                                onClick={() =>
                                  closeClickaway(() => {
                                    if (!isDeleteProcess) {
                                      setIsDeleteProcess(true);
                                      deleteDoc(doc(db, 'products', product.id))
                                        .catch(() => {
                                          showAlertToast('warning', 'Terjadi kesalahan, gagal menghapus produk');
                                          setIsDeleteProcess(false);
                                        })
                                        .then(() => {
                                          for (let i = 0; i < 3; i++) {
                                            deleteObject(ref(storage, `product-photos/${product.id}-${i + 1}`)).catch(() => {});
                                          }
                                          showAlertToast('success', 'Berhasil menghapus produk');
                                          setIsDeleteProcess(false);
                                        });
                                    }
                                  })
                                }
                              >
                                Hapus Produk
                              </Button>
                            </Box>
                          ) : (
                            <></>
                          );
                        })()}
                      </Box>
                    </ClickAwayListener>
                  </TableCell>
                </TableRow>
                <TableRow sx={{ height: index === dataList.length - 1 ? 20 : 8 }} />
              </Fragment>
            ));
          })()}
        />
      </PageRoot>
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}
