import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

const Layout = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthProvider>
      <QueryClientProvider
        client={queryClient}
        options={{
          headerShown: false,
        }}
      >
        <Stack>
          <Stack.Screen
            name="(app)"
            options={{ headerShown: false, gestureEnabled: true }}
          />
          <Stack.Screen name="LoginScreen" options={{ headerShown: false }} />
        </Stack>
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default Layout;
