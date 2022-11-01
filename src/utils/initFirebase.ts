import { initializeApp } from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyBn4cQTwKfI7pRaNBCsMTOWmBpeffdguxw',
  authDomain: 'tradezonemap-9a6e4.firebaseapp.com',
  projectId: 'tradezonemap-9a6e4',
  storageBucket: 'tradezonemap-9a6e4.appspot.com',
  messagingSenderId: '470722069516',
  appId: '1:470722069516:web:5b4be3dc9dbe6928d3da29',
  measurementId: 'G-178QBXG3WN',
};
// function initFirebase() {
//   if (!firebase.getApp.length) {
//     firebase.initializeApp(firebaseConfig);
//   }
// }

// initFirebase();
// export { firebase };

const app = initializeApp(firebaseConfig);
export { app };
