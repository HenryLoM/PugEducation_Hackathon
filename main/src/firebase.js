import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD6Xm--2si58trGqmCvh1wDJRfqgHeJfs8',
  authDomain: 'hackathonedu-7bea5.firebaseapp.com',
  projectId: 'hackathonedu-7bea5',
  appId: '1:542525098046:web:YOUR_APP_ID', // Replace with your actual appId
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
