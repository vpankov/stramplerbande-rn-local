import AsyncStorage from '@react-native-community/async-storage';

import * as constants from './utils/constants';

export const saveCredentials = (username, password) => {
  AsyncStorage.setItem(constants.USERNAME, username);
  AsyncStorage.setItem(constants.PASSWORD, password);
};

export const getCredentials = async () => {
  return {
    username: await AsyncStorage.getItem(constants.USERNAME),
    password: await AsyncStorage.getItem(constants.PASSWORD),
  };
};

export const removeCredentials = () => {
  AsyncStorage.removeItem(constants.USERNAME);
  AsyncStorage.removeItem(constants.PASSWORD);
};
