import React, { useState, useCallback } from "react";
import { Appearance, View, Text, ScrollView, StyleSheet, Button, Linking } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { fetchEvents, BACKEND_URL } from "../api"; // ensure BACKEND_URL is exported from api.js

export default function ExploreScreen() {
  const colorScheme = Appearance.getColorScheme();
  const [events, setEvents] = useState([]);

  const loadEvents = async () => {
    try {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  // Open file in browser or download
  const openFile = (fileUrl) => {
    if (!fileUrl) return alert("No file attached");
    const url = `${BACKEND_URL}${fileUrl}`;
    Linking.openURL(url).catch(() => alert("Cannot open file"));
  };

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
    card: {
      padding: 10,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "#555" : "#ccc",
      borderRadius: 5,
      marginBottom: 10,
      backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
    },
    cardTitle: {
      fontWeight: "bold",
      color: colorScheme === "dark" ? "#fff" : "#000",
      marginBottom: 5,
    },
    cardText: {
      color: colorScheme === "dark" ? "#ddd" : "#333",
      marginBottom: 3,
    },
    buttonContainer: {
      marginTop: 5,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Explore Events</Text>
      {events.length === 0 ? (
        <Text style={styles.cardText}>No events available yet.</Text>
      ) : (
        events.map((e) => (
          <View key={e._id} style={styles.card}>
            <Text style={styles.cardTitle}>{e.name} ({e.category})</Text>
            <Text style={styles.cardText}>{e.startDate} to {e.endDate}</Text>
            <Text style={styles.cardText}>{e.time}</Text>
            <Text style={styles.cardText}>{e.venue}</Text>
            <Text style={styles.cardText}>{e.description}</Text>

            {e.fileUrl && (
              <View style={styles.buttonContainer}>
                <Button title="View/Download File" onPress={() => openFile(e.fileUrl)} />
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
