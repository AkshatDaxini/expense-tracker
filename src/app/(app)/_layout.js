import { View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const Layout = () => {
  const screenOptions = {
    tabBarShowLabel: false,
    headerShown: false,
    animation: "shift",
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 0,
      height: 80,
      backgroundColor: "#ffffff",
    },
  };
  const viewStyle = {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    width: 50,
    height: 50,
    margin: 10,
    elevation: 5,
  };

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="HomeScreen"
        options={{
          gestureEnabled: true,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Entypo
                name="home"
                size={28}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="AddExpenseScreen"
        options={{
          gestureEnabled: true,
          href: null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <FontAwesome5
                name="money-bill-wave"
                size={24}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="BudgetingScreen"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <FontAwesome
                name="balance-scale"
                size={24}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="IncomeScreen"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <FontAwesome5
                name="hand-holding-usd"
                size={24}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="AnalyticsScreen"
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <FontAwesome5
                name="history"
                size={24}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="ProfileScreen"
        options={{
          // href: null,
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                ...viewStyle,
                backgroundColor: focused ? "black" : "transparent",
                padding: 10,
                borderRadius: 5,
              }}
            >
              <Entypo
                name="user"
                size={24}
                color={focused ? "white" : "black"}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

export default Layout;
