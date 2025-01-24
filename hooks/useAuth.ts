import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "../api/client";
import { login, signup } from "../api/queries/authService";
import { Alert } from "react-native";
import { queryClient } from "../utils/queryClient";
import { router, useSegments } from "expo-router";
import { IUser } from "../types/index";

type User<IUser> = {
  id: string;
  name: string;
  email: string;
  user_type: string;
};

function useProtectedRoute(user: User | null) {
  const segments = useSegments();

  // useEffect(() => {
  //   const inAuthGroup = segments[0] === "(auth)";

  //   console.log(inAuthGroup);

  //   if (!user && inAuthGroup) {
  //     router.replace("/login");
  //   } else if (user && !inAuthGroup) {
  //     router.replace("/(auth)/(tabs)/");
  //   }
  // }, [user, segments]);
}

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      login(credentials),
    onSuccess: (data) => {
      if (data.messageType === "success") {
        queryClient.setQueryData("data", data);
        router.replace("/home");
      }
    },
    onError: (error) => {
      return error;
    },
  });
};

export const useSignup = () => {
  return useMutation({
    mutationFn: (credentials: {
      name: string;
      email: string;
      password: string;
      userType: string;
    }) => signup(credentials),
    onSuccess: (data) => {
      if (data.messageType === "success") {
        queryClient.setQueryData("data", data);
        router.replace("/welcome");
      }
    },
    onError: (error) => {
      console.error("Signup Failed", error);
      return error;
    },
  });
};
