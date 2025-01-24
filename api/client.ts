import axios, {
  AxiosError,
  AxiosResponse,
  AxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { Platform } from "react-native";
import { saveToken, getToken, deleteToken } from "./tokenStorage";
import { DEV_API_URL } from "@env";
import { router } from "expo-router";

const API_URL =
  process.env.EXPO_PUBLIC_NODE_ENV === "development"
    ? process.env.EXPO_PUBLIC_DEV_API_URL
    : process.env.EXPO_PUBLIC_PROD_API_URL;

interface InternalAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

const createAxiosClient = (): AxiosInstance => {
  const axiosClient = axios.create({
    baseURL: API_URL,
    timeout: 10000, // Set a reasonable timeout
    headers: {
      "Content-Type": "application/json",
    },
    // Only disables HTTPS verification on Android
    ...(Platform.OS === "android" && {
      httpsAgent: { rejectUnauthorized: false },
    }),
  });

  const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });

    failedQueue = [];
  };

  axiosClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const accessToken = await getToken("accessToken");
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  axiosClient.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              if (token) {
                originalRequest.headers["Authorization"] = `Bearer ${token}`;
              }
              return axiosClient(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const refreshToken = await getToken("refreshToken");
          if (!refreshToken) {
            await handleAuthError();
            return Promise.reject(error);
          }

          const response = await axios.post(`${API_URL}/token/refresh`, {
            refreshToken,
          });
          const { accessToken, newRefreshToken } = response.data;

          await saveToken("accessToken", accessToken);
          await saveToken("refreshToken", newRefreshToken);

          axiosClient.defaults.headers[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;

          processQueue(null, accessToken);
          return axiosClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          await handleAuthError();
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return axiosClient;
};

const handleAuthError = async (): Promise<void> => {
  await deleteToken("accessToken");
  await deleteToken("refreshToken");
  // Redirect to login or another appropriate action
  // Ensure correct navigation action
  // router.push("/home");
};

const AxiosClient = createAxiosClient();

export default AxiosClient;
