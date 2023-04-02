/* eslint-disable no-loop-func */
import * as actionTypes from '../action';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db, storage } from 'config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const paths = { admin: 'admins', customer: 'customers' };

// InitialState
export const initialState = {
  isLogin: null,
  username: null,
  role: null
};

export function restoreSession(action) {
  return async function restoreSessionThunk(dispatch, getState) {
    if (action.username !== null) {
      let data = getState().accountReducer.data;
      let role = getState().accountReducer.role;
      let errorCheck = false;
      for (const path in paths) {
        try {
          const docSnapshot = await getDoc(doc(db, paths[path], action.username)).catch(() => {});
          if (docSnapshot && docSnapshot.exists()) {
            data = { id: docSnapshot.id, ...docSnapshot.data() };
            role = path;
            break;
          }
        } catch (e) {
          errorCheck = true;
          break;
        }
      }

      if (!errorCheck) {
        dispatch({ type: actionTypes.RESTORE_SESSION, data: data, role: role });
      }
    }
  };
}

export function loginSession(action) {
  return async function loginSessionThunk(dispatch, getState) {
    let role = getState().accountReducer.role;

    const showAlert = (type, text) => {
      action.showAlertToast(type, text);
      action.setIsLoginProcess(false);
    };

    if (!action.isLoginProcess && action.data.username.length > 0 && action.data.password.length > 0) {
      action.setIsLoginProcess(true);

      let docSnapshot = null;
      let errorCheck = false;
      for (const path in paths) {
        try {
          docSnapshot = await getDoc(doc(db, paths[path], action.data.username.toString()));
          if (docSnapshot !== null && docSnapshot.exists()) {
            role = path;
            break;
          }
        } catch (e) {
          errorCheck = true;
          break;
        }
      }

      if (!errorCheck) {
        if (docSnapshot && docSnapshot.exists()) {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              (await getDoc(doc(db, paths[role], action.data.username.toString()))).data().email,
              action.data.password.toString()
            );
            if (userCredential.user) {
              action.showAlertToast('success', 'Berhasil Login akun');
              action.clearAuthForm();
              dispatch({ type: actionTypes.RESTORE_SESSION, data: { id: docSnapshot.id, ...docSnapshot.data() }, role: role });
              switch (role) {
                case 'admin':
                  return action.navigate('/admin/dashboard');

                case 'customer':
                  return action.navigate('/customer/dashboard');

                default:
                  break;
              }
            } else {
              throw Error;
            }
          } catch (error) {
            if (error.code === 'auth/wrong-password') {
              showAlert('error', 'Password yang dimasukkan salah');
            } else {
              showAlert('warning', error.message);
            }
          }
        } else {
          showAlert('error', 'Username yang dimasukkan salah');
        }
      } else {
        showAlert('warning', 'Terjadi kesalahan, silahkan coba kembali');
      }
    } else if (action.data.username.length <= 0 || action.data.password.length <= 0) {
      showAlert('warning', 'Silahkan lengkapi form login dengan benar');
    } else {
      action.showAlertToast('info', 'Login akun sedang di proses, mohon tunggu beberapa saat');
    }
  };
}

export function registerSession(action) {
  return async function registerSessionThunk() {
    const showAlert = (type, text) => {
      action.showAlertToast(type, text);
      action.setIsRegisterProcess(false);
    };

    if (!action.isRegisterProcess) {
      action.setIsRegisterProcess(true);
      if (
        action.data.username.length <= 0 &&
        action.data.fullname.length <= 0 &&
        action.data.email.length <= 0 &&
        action.data.password.length <= 0
      ) {
        showAlert('warning', 'Silahkan lengkapi form login dengan benar');
      } else if (action.data.username.length < 4 && action.data.username === action.data.username.toLowerCase()) {
        showAlert('warning', 'Username harus terdiri dari huruf kecil dan minimal 4 karakter');
      } else if (!action.data.email.substring(action.data.email.length - 10, action.data.email.length) === '@gmail.com') {
        showAlert('warning', 'Email yang dimasukkan tidak dapat digunakan');
      } else if (action.data.password.length < 8) {
        showAlert('warning', 'Password harus terdiri dari minimal 8 karakter');
      } else {
        let errorCheck = false;
        let emailAlreadyExists = false;
        let usernameAlreadyExists = false;
        for (const path in paths) {
          try {
            const usernameSnapshot = await getDoc(doc(db, paths[path], action.data.username));
            if (usernameSnapshot && usernameSnapshot.exists()) {
              usernameAlreadyExists = true;
              break;
            }

            const emailSnapshot = await getDocs(query(collection(db, paths[path]), where('email', '==', action.data.email)));
            if (emailSnapshot && !emailSnapshot.empty) {
              emailAlreadyExists = true;
              break;
            }
          } catch (e) {
            errorCheck = true;
            break;
          }
        }

        if (errorCheck) {
          showAlert('warning', 'Terjadi kesalahan, silahkan coba lagi');
        } else if (usernameAlreadyExists) {
          showAlert('warning', 'Username yang dimasukkan telah digunakan');
        } else if (emailAlreadyExists) {
          showAlert('warning', 'Email yang dimasukkan telah digunakan');
        } else {
          try {
            const userCredential = await createUserWithEmailAndPassword(auth, action.data.email, action.data.password);

            await setDoc(doc(db, 'customers', action.data.username), {
              uid: userCredential.user.uid,
              username: action.data.username,
              fullname: action.data.fullname,
              email: action.data.email,
              photoUrl: ''
            });

            await updateProfile(userCredential.user, {
              displayName: action.data.username
            });

            await auth.signOut();

            action.showAlertToast('success', 'Berhasil daftar akun');
            action.clearAuthForm();
          } catch (e) {
            showAlert('warning', 'Terjadi kesalahan, silahkan coba lagi');
          }
        }
      }
    } else {
      action.showAlertToast('info', 'Register akun sedang di proses, mohon tunggu beberapa saat');
    }
  };
}

export function updateIdentity(action) {
  return async function updateIdentityThunk(dispatch, getState) {
    if (action.data !== null) {
      let result;
      if (action.data['photoUrl']) {
        try {
          const snapshot = await uploadBytes(ref(storage, `/${paths[action.role]}-profile/${action.username}`), action.data.photoUrl);
          result = await getDownloadURL(snapshot.ref);
        } catch (e) {
          result = null;
        }
      } else {
        result = ' ';
      }

      if (result) {
        await updateDoc(doc(db, paths[action.role], action.username), {
          ...(result !== ' ' ? { ...action.data, photoUrl: result } : { ...action.data })
        })
          .catch((error) => {
            action.setIsUpdateProcess(false);
            action.showAlert('warning', error.message);
          })
          .then(() => {
            dispatch({
              type: actionTypes.RESTORE_SESSION,
              data: { ...getState().accountReducer, ...(result !== ' ' ? { ...action.data, photoUrl: result } : { ...action.data }) },
              role: action.role
            });
            action.showAlert('success', 'Data profil berhasil diperbarui');
            action.setIsUpdateProcess(false);
            action.handleClose();
          });
      } else {
        action.showAlert('warning', 'Terjadi kesalahan, silahkan coba kembali');
        action.setIsUpdateProcess(false);
      }
    }
  };
}

const accountReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.CLEAR_SESSION:
      return {
        username: '',
        role: '',
        isLogin: false
      };

    case actionTypes.RESTORE_SESSION:
      return {
        ...action.data,
        username: action.data.id,
        role: action.role,
        isLogin: true
      };

    default:
      return state;
  }
};

export default accountReducer;
