import React from "react";
import { Appearance, View, Text, ScrollView, StyleSheet } from "react-native";

export default function HomeScreen() {
  const colorScheme = Appearance.getColorScheme(); // 'dark' or 'light'

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: colorScheme === "dark" ? "#121212" : "#f9f9f9",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 15,
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    text: {
      fontSize: 16,
      color: colorScheme === "dark" ? "#ddd" : "#333",
      marginBottom: 10,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Welcome to the Home Page</Text>
      <Text style={styles.text}>
        This is the Home tab. You can put any content here, like recent announcements, dashboard info, or anything else.
      </Text>
      <Text style={styles.text}>
        Dark and light mode are supported automatically, so all text is readable regardless of device theme.
      </Text>
      <Text style={styles.text}>
        Add more components or cards here as needed to match your app's design.
      </Text>
    </ScrollView>
  );
}
