// frontend/app/screens/StudentScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  TextInput,
  Linking,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { fetchEvents, BACKEND_URL } from "../api";
import { Stack, useRouter } from "expo-router";

export default function StudentScreen() {
  const router = useRouter();

  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const loadEvents = async () => {
    try {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load events");
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const openFile = async (fileUrl) => {
    if (!fileUrl) return Alert.alert("No file attached");

    const url = fileUrl.startsWith("http")
      ? fileUrl
      : `${BACKEND_URL.replace(/\/$/, "")}/${fileUrl.replace(/^\/?/, "")}`;

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert("Cannot open URL", "This link cannot be opened on your device");
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => router.replace("/"), // Navigate to home
        },
      ],
      { cancelable: true }
    );
  };

  const filteredEvents = events.filter((e) => {
    const today = new Date();
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);

    if (filter === "ongoing" && !(start <= today && end >= today)) return false;
    if (filter === "upcoming" && !(start > today)) return false;
    if (filter === "past" && !(end < today)) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.name?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.time?.toLowerCase().includes(q)
    );
  });

  const isOngoing = (e) => {
    const today = new Date();
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return start <= today && end >= today;
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: "#fff" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 15, color: "#000" },
    input: { borderWidth: 1, padding: 10, marginVertical: 10, borderRadius: 5, borderColor: "#ccc", color: "#000" },
    card: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginBottom: 10, backgroundColor: "#fff" },
    cardTitle: { fontWeight: "bold", color: "#000", marginBottom: 5 },
    cardText: { color: "#333", marginBottom: 3 },
    buttonContainer: { marginTop: 5 },
    picker: { marginVertical: 10, borderWidth: 1, borderColor: "#ccc" },
  });

  return (
    <>
      {/* This Stack allows header customization in Expo Router */}
      <Stack.Screen
        options={{
          title: "Explore Events",
          headerRight: () => <Button title="Logout" onPress={handleLogout} color="#FF4500" />,
        }}
      />
      <ScrollView style={styles.container}>
        {/* Search Bar */}
        <TextInput
          placeholder="Search events..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.input}
          placeholderTextColor="#888"
        />

        {/* Filter Dropdown */}
        <Picker
          selectedValue={filter}
          onValueChange={(val) => setFilter(val)}
          style={{ ...styles.picker, color: "#000", backgroundColor: "#fff" }}
          itemStyle={{ color: "#000" }}
        >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Ongoing" value="ongoing" />
          <Picker.Item label="Upcoming" value="upcoming" />
          <Picker.Item label="Past" value="past" />
        </Picker>

        {/* Event Cards */}
        {filteredEvents.length === 0 ? (
          <Text style={styles.cardText}>No events available.</Text>
        ) : (
          filteredEvents.map((e) => (
            <View
              key={e._id}
              style={[
                styles.card,
                isOngoing(e) && { borderColor: "#1E90FF", borderWidth: 2, backgroundColor: "#E0F0FF" },
              ]}
            >
              <Text style={styles.cardTitle}>{e.name} {e.category ? `(${e.category})` : null}</Text>
              <Text style={styles.cardText}>
                {new Date(e.startDate).toLocaleDateString()} to {new Date(e.endDate).toLocaleDateString()}
              </Text>
              <Text style={styles.cardText}>{e.time}</Text>
              <Text style={styles.cardText}>{e.venue}</Text>
              <Text style={styles.cardText}>{e.description}</Text>

              {e.fileUrl && (
                <View style={styles.buttonContainer}>
                  <Button title="Open File Link" onPress={() => openFile(e.fileUrl)} color="#1E90FF" />
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </>
  );
}
