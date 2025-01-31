// src/app/index.js
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext"; // Import the useAuth hook

const Index = () => {
  return (
    <>
      <Text>Index</Text>
    </>
  );
};

export default Index;
