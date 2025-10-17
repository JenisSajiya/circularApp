//frontend/app/screens/AdminScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchEvents, createEvent, getToken } from "../api";

export default function AdminScreen() {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fileUrl, setFileUrl] = useState(""); // Drive URL input
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Submit event with Drive URL (JSON body)
  const submitEvent = async () => {
    if (!name || !startDate || !endDate || !time || !venue) {
      return Alert.alert(
        "Validation",
        "Please fill required fields: name, startDate, endDate, time, venue"
      );
    }

    if (fileUrl && !/^https?:\/\/.+$/.test(fileUrl)) {
      return Alert.alert(
        "Invalid URL",
        "Please enter a valid http(s) URL for the Drive link"
      );
    }

    const payload = {
      name,
      startDate,
      endDate,
      time,
      venue,
      description,
      category,
      fileUrl: fileUrl || null,
    };

    try {
      const token = await getToken();
      if (!token) {
        return Alert.alert(
          "Unauthorized",
          "You are not logged in. Please login again."
        );
      }

      await createEvent(payload); // createEvent uses token automatically
      Alert.alert("Success", "Event Created Successfully");
      clearForm();
      loadEvents();
    } catch (err) {
      console.error(err);
      if (
        err.message.includes("401") ||
        err.message.toLowerCase().includes("unauthorized")
      ) {
        Alert.alert("Unauthorized", "Your session has expired. Please login again.");
      } else {
        Alert.alert("Error", err.message || "Failed to create event");
      }
    }
  };

  const loadEvents = async () => {
    try {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load events");
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const clearForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setTime("");
    setVenue("");
    setDescription("");
    setCategory("");
    setFileUrl("");
  };

  // Open Drive link
  const openUrl = async (url) => {
    try {
      if (!url) return Alert.alert("No file attached");
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Cannot open URL", "This link cannot be opened on your device");
      }
    } catch (err) {
      console.error("openUrl error:", err);
      Alert.alert("Error", "Failed to open URL");
    }
  };

  // Filter and search events
  const filteredEvents = events.filter((e) => {
    const today = new Date();
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);

    if (filter === "ongoing" && !(start <= today && end >= today)) return false;
    if (filter === "upcoming" && !(start > today)) return false;
    if (filter === "past" && !(end < today)) return false;

    if (searchQuery.trim() === "") return true;
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
    input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5, borderColor: "#ccc", color: "#000" },
    buttonContainer: { marginVertical: 5 },
    card: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginVertical: 5, backgroundColor: "#fff" },
    cardTitle: { fontWeight: "bold", color: "#000" },
    cardText: { color: "#333" },
    headerText: { marginTop: 20, fontSize: 18, color: "#000" },
    picker: { marginVertical: 10, borderWidth: 1, borderColor: "#ccc" },
    linkText: { color: "#1E90FF", textDecorationLine: "underline" },
  });

  return (
    <ScrollView style={styles.container}>
      {/* Form Inputs */}
      <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Time" value={time} onChangeText={setTime} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Venue" value={venue} onChangeText={setVenue} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} placeholderTextColor="#888" />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor="#888" />

      {/* Drive URL */}
      <TextInput
        placeholder="Google Drive URL (optional)"
        value={fileUrl}
        onChangeText={setFileUrl}
        style={styles.input}
        placeholderTextColor="#888"
        autoCapitalize="none"
      />

      <View style={styles.buttonContainer}>
        <Button title="Submit Event" onPress={submitEvent} color="#1E90FF" />
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search events..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.input}
        placeholderTextColor="#888"
      />

      {/* Filter */}
      <Text style={styles.headerText}>Filter Events:</Text>
      <Picker selectedValue={filter} onValueChange={(val) => setFilter(val)} style={styles.picker}>
        <Picker.Item label="All" value="all" />
        <Picker.Item label="Ongoing" value="ongoing" />
        <Picker.Item label="Upcoming" value="upcoming" />
        <Picker.Item label="Past" value="past" />
      </Picker>

      {/* Event Cards */}
      <Text style={styles.headerText}>Events:</Text>
      {filteredEvents.length === 0 ? (
        <Text style={styles.cardText}>No events available.</Text>
      ) : (
        filteredEvents.map((e) => (
          <View
            key={e._id}
            style={[
              styles.card,
              isOngoing(e) && { borderColor: "#1E90FF", borderWidth: 2, backgroundColor: "#E0F0FF" }
            ]}
          >
            <Text style={styles.cardTitle}>{e.name} {e.category ? `(${e.category})` : null}</Text>
            <Text style={styles.cardText}>{new Date(e.startDate).toLocaleDateString()} to {new Date(e.endDate).toLocaleDateString()}</Text>
            <Text style={styles.cardText}>{e.time}</Text>
            <Text style={styles.cardText}>{e.venue}</Text>
            <Text style={styles.cardText}>{e.description}</Text>

            {e.fileUrl && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => openUrl(e.fileUrl)}>
                  <Text style={styles.linkText}>Open Drive Link</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}
