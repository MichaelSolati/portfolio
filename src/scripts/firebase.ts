import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';

const firebase = initializeApp(window['firebaseConfig']);

getAnalytics(firebase);
