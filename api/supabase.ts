import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from "@env";

const url = EXPO_PUBLIC_SUPABASE_URL;
const key = EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
