import { Platform } from 'react-native';

// API
// eslint-disable-next-line import/prefer-default-export
export const API_URL = 'https://drippy-api.herokuapp.com';

// IAP
export const DRIPPY_PRO_IOS = 'com.IanRichard.Drippy.Pro';
export const itemSkus = Platform.select({
  ios: [
    DRIPPY_PRO_IOS
  ]
});
