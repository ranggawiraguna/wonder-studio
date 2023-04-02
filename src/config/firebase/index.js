import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAGvmgvFV2jz_nLSVpJtUUcMpEcW5r4bnM',
  authDomain: 'wonder-studio.firebaseapp.com',
  projectId: 'wonder-studio',
  storageBucket: 'wonder-studio.appspot.com',
  messagingSenderId: '159574151176'
};

const app = initializeApp(
  {
    ...firebaseConfig,
    appId: '1:159574151176:web:33caaa3536114c9e7501bd',
    measurementId: 'G-13M0YZVEZ3'
  },
  'Main'
);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const otherApp = initializeApp(
  {
    ...firebaseConfig,
    appId: '1:159574151176:web:25e408b32c7fcf4b7501bd',
    measurementId: 'G-DW1SMDRKC9'
  },
  'Secondary'
);
const otherAuth = getAuth(otherApp);

export { app, analytics, auth, db, storage, otherApp, otherAuth };
