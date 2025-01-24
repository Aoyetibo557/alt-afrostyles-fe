import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export const saveToken = async (key, value) => {
  await SecureStore.setItemAsync(key, value);
};

export const getToken = async (key) => {
  return await SecureStore.getItemAsync(key);
};

export const deleteToken = async (key) => {
  await SecureStore.deleteItemAsync(key);
};

export const decodeToken = (token: string): string => {
  const decoded = jwtDecode<{ _id: string; userType: string }>(token);
  return { userId: decoded._id, userType: decoded.userType };
};
