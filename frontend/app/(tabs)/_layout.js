// tabs/layout.js
import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "Home" }}
      />
      <Tabs.Screen
        name="admin"
        options={{ title: "Admin" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "Explore" }}
      />
    </Tabs>
  );
}
