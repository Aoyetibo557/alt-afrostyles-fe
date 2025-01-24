import AxiosClient from "./client";
import { saveToken, getToken } from "./tokenStorage";
import { Credentials, AuthResponse, LoginResponse } from "@/types/index";

export const login = async (
  cred: Credentials
): Promise<LoginResponse | string> => {
  try {
    const response = await AxiosClient.post<AuthResponse>(`/auth/login`, {
      email: cred.email,
      password: cred.password,
    });

    if (response.data.messageType === "success") {
      await saveToken("accessToken", response.data.accessToken);
      await saveToken("refreshToken", response.data.refreshToken);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error logging in", error);
    return error.message;
  }
};

const signup = async (cred) => {
  try {
    const response = await AxiosClient.post<AuthResponse>(`/auth/signup`, {
      name: cred.name,
      email: cred.email,
      password: cred.password,
      userType: cred.userType,
    });
    if (response.messageType === "success") {
      await saveToken("accessToken", response.accessToken);
      await saveToken("refreshToken", response.refreshToken);
      return response.data;
    } else {
      return response.data;
    }
  } catch (error) {
    console.error("Error creating in", error);
    return error.message;
  }
};

const fetchUser = async (userId) => {
  try {
    const response = await AxiosClient.get<AuthResponse>(
      `/user/getuser/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${await getToken("accessToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    return error.message;
  }
};

export { login, signup, fetchUser };
