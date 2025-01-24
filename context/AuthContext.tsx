import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../utils/queryClient";
import { jwtDecode } from "jwt-decode";
import { login, signup, fetchUser } from "@/api/authService";
import { getToken, saveToken, deleteToken } from "../api/tokenStorage";
import { useRouter, useSegments } from "expo-router";
import { useAlert } from "./AlertContext";
import { IUser, AuthContextType } from "../types/index";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { showAlert, hideAlert } = useAlert();

  const [user, setUser] = useState<IUser | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const segments = useSegments();

  const decodeToken = useCallback((token: string): string => {
    const decoded = jwtDecode<{ _id: string; userType: string }>(token);
    return { userId: decoded._id, userType: decoded.userType };
  }, []);

  const fetchUserDetails = useCallback(
    async (accessToken: string) => {
      try {
        setIsPending(true);
        const { userId } = decodeToken(accessToken);
        const response = await fetchUser(userId);
        if (response.messageType === "success") {
          setUser(response?.user);
        }
      } catch (error) {
        console.error("Failed to fetch user details", error);
        setError("Failed to fetch user details");
      } finally {
        setIsPending(false);
      }
    },
    [decodeToken]
  );

  const handleAuthSuccess = useCallback(
    async (data: { accessToken: string; user: IUser }) => {
      await fetchUserDetails(data?.accessToken);
      queryClient.setQueryData(["user"], data.user);
    },
    [fetchUserDetails, queryClient]
  );

  const loginMutation = useMutation({
    mutationFn: login,
    onMutate: () => setIsPending(true),
    onSuccess: async (data) => {
      setIsPending(false);
      if (data.messageType === "success") {
        await handleAuthSuccess(data);
        router.replace("/home-screens/home");
      } else {
        setError(data.message);
        showAlert(
          "error",
          "Oops, Something went wrong logging in. Try again later."
        );
      }
    },
    onError: (error: Error) => {
      setIsPending(false);
      setError(error.message || "An error occurred during login");
      showAlert("error", error.message);
    },
  });

  const signupMutation = useMutation({
    mutationFn: signup,
    onMutate: () => setIsPending(true),
    onSuccess: async (data) => {
      setIsPending(false);
      if (data.messageType === "success") {
        await handleAuthSuccess(data);
        if (data?.userType === "designer") {
          router.replace("/(onboarding)/store-setup");
        } else {
          router.replace("/home-screens/home");
        }
      } else {
        setError(data.message);
        showAlert("error", data.message);
      }
    },
    onError: (error: Error) => {
      setIsPending(false);
      setError(error.message || "An error occurred during signup");
      showAlert("error", error.message || "An error occurred during signup");
    },
  });

  const logout = useCallback(async () => {
    setUser(null);
    await deleteToken("accessToken");
    await deleteToken("refreshToken");
    queryClient.clear();
    router.replace("home-screens/home");
  }, [queryClient, router]);

  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = await getToken("accessToken");
      if (accessToken) {
        await fetchUserDetails(accessToken);
      }
    };
    initializeAuth();
  }, [fetchUserDetails]);

  const contextValue: AuthContextType = {
    user,
    setUser,
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout,
    isAuthPending: isPending,
    error,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
