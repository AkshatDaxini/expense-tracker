import { View, Text, SafeAreaView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { Drawer } from "react-native-drawer-layout";

const ProfileScreen = () => {
  const router = useRouter();
  const { logout, userInfo, loading } = useAuth();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      router.replace("LoginScreen");
    } else {
      console.log(res.error);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!userInfo) {
    return (
      <SafeAreaView>
        <Text>No user data found.</Text>
      </SafeAreaView>
    );
  }
  {
    <View>
      <Text>Profile</Text>
      <Text>Email: {userInfo.email}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>;
  }

  return (
    <Drawer
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      renderDrawerContent={() => {
        return <Text>Drawer content</Text>;
      }}
    >
      <Button
        onPress={() => setOpen((prevOpen) => !prevOpen)}
        title={`${open ? "Close" : "Open"} drawer`}
      />
    </Drawer>
  );
};

export default ProfileScreen;
