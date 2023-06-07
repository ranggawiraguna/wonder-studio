import { Avatar, Collapse, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import TableDisplay from 'containers/templates/TableDisplay';
import { tableDisplayType } from 'utils/other/EnvironmentValues';
import PageRoot from './styled';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Fragment, useEffect, useState } from 'react';
import { Box } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { MENU_OPEN, SET_ACTIVE } from 'utils/redux/action';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from 'config/firebase';
import { dateFormatter, moneyFormatter } from 'utils/other/Services';

const tableHeadContent = ['', 'Username', 'Nama Lengkap', 'Foto Profil', 'Email'];

const tableAlignContent = ['center', 'left', 'left', 'center', 'left'];

const RowDisplay = ({ customer, customerOrders }) => {
  const [open, setOpen] = useState(false);

  const getBorder = (condition) => (condition ? 0 : {});

  return (
    <Fragment>
      <TableRow>
        <TableCell sx={{ border: getBorder(open) }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ border: getBorder(open) }} align={tableAlignContent[1]}>
          {customer.username}
        </TableCell>
        <TableCell sx={{ border: getBorder(open) }} align={tableAlignContent[2]}>
          {customer.fullname}
        </TableCell>
        <TableCell sx={{ border: getBorder(open) }} align={tableAlignContent[3]}>
          <Avatar sx={{ margin: '0 auto' }} src={customer.photoUrl} />
        </TableCell>
        <TableCell sx={{ border: getBorder(open) }} align={tableAlignContent[6]}>
          {customer.email}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell sx={{ border: getBorder(!open), paddingBottom: 0, paddingTop: 0 }} />
        <TableCell sx={{ border: getBorder(!open), paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box className="row-collapse">
              <Typography variant="h5" component="h5">
                Riwayat Pesanan
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tanggal</TableCell>
                    <TableCell>Waktu</TableCell>
                    <TableCell>No.Pesanan</TableCell>
                    <TableCell>Jumlah Pesanan</TableCell>
                    <TableCell>Total Harga</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customerOrders.length > 0 ? (
                    customerOrders.map((order, index) => (
                      <TableRow key={index}>
                        <TableCell>{dateFormatter(order.dateCreated, 'd MMMM yyyy')}</TableCell>
                        <TableCell>{dateFormatter(order.dateCreated, 'HH:mm')}</TableCell>
                        <TableCell>{order.id}</TableCell>
                        <TableCell>{order.products.reduce((a, b) => a + b.count, 0)}</TableCell>
                        <TableCell>{moneyFormatter(order.products.reduce((a, b) => a + b.price, 0))}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <></>
                  )}
                  {customerOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        Belum terdapat riwayat pesanan pada pelanggan ini.
                      </TableCell>
                    </TableRow>
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  );
};

export default function CustomerListPage() {
  const dispatch = useDispatch();
  const sidebarReducer = useSelector((state) => state.sidebarReducer);
  const searchReducer = useSelector((state) => state.searchReducer);

  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    setDataList(
      customers.filter(
        (customer) =>
          customer.id.toLowerCase().includes(searchReducer.value.toLowerCase()) ||
          customer.fullname.toLowerCase().includes(searchReducer.value.toLowerCase())
      )
    );
  }, [customers, searchReducer.value]);

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'daftar-pelanggan') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'daftar-pelanggan' });
    }

    const listenerCustomers = onSnapshot(query(collection(db, 'customers'), orderBy('username')), (snapshot) =>
      setCustomers(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );

    const listenerOrders = onSnapshot(query(collection(db, 'orders')), (snapshot) =>
      setOrders(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })))
    );

    dispatch({ type: SET_ACTIVE, status: true });

    return () => {
      listenerCustomers();
      listenerOrders();
      dispatch({ type: SET_ACTIVE, status: false });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageRoot>
      <TableDisplay
        title="Data Pelanggan"
        tableContentType={tableDisplayType.row}
        tableAlignContent={tableAlignContent}
        tableHeadContent={tableHeadContent}
        tableBodyContent={(() => {
          return dataList.map((customer, index) => (
            <RowDisplay key={index} customer={customer} customerOrders={orders.filter((order) => order.customerId === customer.id)} />
          ));
        })()}
      />
    </PageRoot>
  );
}
