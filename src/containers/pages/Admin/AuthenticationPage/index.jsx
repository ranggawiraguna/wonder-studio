import { Avatar, Box, Button, CardMedia, ClickAwayListener, TableCell, TableRow, Typography } from '@mui/material';
import { tableDisplayType } from 'utils/other/EnvironmentValues';
import TableDisplay from 'containers/templates/TableDisplay';
import IconOptiontDetail from 'assets/images/icon/ProductOptionDetail.svg';
import PageRoot from './styled';
import { Fragment, useEffect, useState } from 'react';
import { MENU_OPEN } from 'utils/redux/action';
import { useDispatch, useSelector } from 'react-redux';
import DialogEditAdmin from 'components/views/DialogActionAuth/EditAdmin';
import DialogAddAdmin from 'components/views/DialogActionAuth/AddAdmin';
import { collection, deleteDoc, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db, otherAuth, storage } from 'config/firebase';
import { deleteUser, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import AlertToast from 'components/elements/AlertToast';
import { deleteObject, ref } from 'firebase/storage';

const tableHeadContent = ['No.', 'Username', 'Email', 'Nama Lengkap', 'Foto Profil', 'Ubah Akun'];
const tableAlignContent = ['center', 'left', 'left', 'left', 'center', 'center'];

export default function AuthenticationPage() {
  const dispatch = useDispatch();
  const accountReducer = useSelector((state) => state.accountReducer);
  const sidebarReducer = useSelector((state) => state.sidebarReducer);

  const [openDialogAddAdmin, setOpenDialogAddAdmin] = useState(false);
  const [openDialogEditAdmin, setOpenDialogEditAdmin] = useState(false);

  const [accountSelected, setAccountSelected] = useState({
    id: '',
    fullname: '',
    photoUrl: ''
  });

  const [admins, setAdmins] = useState([]);
  const [isOpenOption, setIsOpenOption] = useState([]);
  const [alertDescription, setAlertDescription] = useState({
    isOpen: false,
    type: 'info',
    text: '',
    transitionName: 'slideUp'
  });

  const handleSendLinkReset = (email) => {
    sendPasswordResetEmail(otherAuth, email)
      .then(() => {
        setAlertDescription({
          isOpen: true,
          type: 'success',
          text: 'Link reset password telah dikirim melalui email',
          transitionName: 'slideUp'
        });
      })
      .catch((error) => {
        setAlertDescription({
          isOpen: true,
          type: 'warning',
          text: error.toString(),
          transitionName: 'slideUp'
        });
      });
  };

  useEffect(() => {
    if (!(sidebarReducer.isOpen.findIndex((id) => id === 'authentication') > -1)) {
      dispatch({ type: MENU_OPEN, id: 'authentication' });
    }
    const listenerAdmins = onSnapshot(query(collection(db, 'admins'), where('username', '!=', accountReducer.username)), (snapshot) => {
      setAdmins(snapshot.docs.map((document) => ({ id: document.id, ...document.data() })));
      setIsOpenOption(snapshot.docs.map(() => false));
    });

    return () => {
      listenerAdmins();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Fragment>
      <PageRoot>
        <TableDisplay
          title="Data Admin"
          withButtonHeader={true}
          buttonText="Tambah Admin"
          buttonAction={() => setOpenDialogAddAdmin(true)}
          tableContentType={tableDisplayType.row}
          tableAlignContent={tableAlignContent}
          tableHeadContent={tableHeadContent}
          tableBodyContent={(() => {
            if (admins.length <= 0) {
              return (
                <TableRow>
                  <TableCell colSpan={tableHeadContent.length} align="center">
                    <Typography variant="p" component="p" sx={{ color: 'rgba(0,0,0,0.6)' }}>
                      Belum terdapat admin yang tersedia
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            }

            return admins.map((admin, index) => (
              <TableRow key={index}>
                <TableCell align={tableAlignContent[0]}>{index + 1}</TableCell>
                <TableCell align={tableAlignContent[1]}>{admin.username}</TableCell>
                <TableCell align={tableAlignContent[2]}>{admin.email}</TableCell>
                <TableCell align={tableAlignContent[3]}>{admin.fullname}</TableCell>
                <TableCell align={tableAlignContent[4]}>
                  <Avatar sx={{ margin: '0 auto' }} src={admin.photoUrl} />
                </TableCell>
                <TableCell align={tableAlignContent[5]}>
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
                              onClick={() => {
                                closeClickaway(() => {
                                  setAccountSelected(admin);
                                  setOpenDialogEditAdmin(true);
                                });
                              }}
                            >
                              Edit User
                            </Button>
                            <Button
                              onClick={() => {
                                closeClickaway(async () => {
                                  try {
                                    deleteDoc(doc(db, 'admins', admin.id));
                                    deleteObject(ref(storage, `/admin-profiles/${admin.username}`));
                                    deleteUser(
                                      (await signInWithEmailAndPassword(otherAuth, admin.email.toLowerCase(), admin.password)).user
                                    );
                                  } catch (_) {
                                    setAlertDescription({
                                      isOpen: true,
                                      type: 'error',
                                      text: _.toString(),
                                      transitionName: 'slideUp'
                                    });
                                  }
                                });
                              }}
                            >
                              Hapus User
                            </Button>
                            <Button
                              onClick={() => {
                                closeClickaway(() => {
                                  handleSendLinkReset(admin.email);
                                });
                              }}
                            >
                              Kirim Link Reset
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
            ));
          })()}
        />
      </PageRoot>
      <DialogEditAdmin data={accountSelected} open={openDialogEditAdmin} onClose={() => setOpenDialogEditAdmin(false)} />
      <DialogAddAdmin open={openDialogAddAdmin} onClose={() => setOpenDialogAddAdmin(false)} />
      <AlertToast description={alertDescription} setDescription={setAlertDescription} />
    </Fragment>
  );
}
