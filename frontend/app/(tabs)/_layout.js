//frontend/app/(tabs)/_layout.js
import React from "react";
import { Tabs } from "expo-router";
import { Text, Image, View } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarStyle: { display: "none" },
        headerLeft: () => (
          <View style={{ marginLeft: 10 }}>
            <Image
              source={require("../assets/logo.png")} // <-- replace with your logo path
              style={{ width: 40, height: 40, resizeMode: "contain" }}
            />
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: "TCE CIRCULARS" }}
      />
      <Tabs.Screen
        name="admin"
        options={{ title: "TCE CIRCULARS" }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: "TCE CIRCULARS" }}
      />
    </Tabs>
  );
}
