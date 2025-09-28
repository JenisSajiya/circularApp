import React, { useState, useEffect } from "react";
import { Appearance, View, TextInput, Button, Text, ScrollView, StyleSheet, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { fetchEvents, createEvent } from "../api";

export default function AdminScreen() {
  const colorScheme = Appearance.getColorScheme();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState(null);
  const [events, setEvents] = useState([]);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({});
    if (result.type === "success") setFile(result);
  };

  const submitEvent = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("time", time);
    formData.append("venue", venue);
    formData.append("description", description);
    formData.append("category", category);

    if (file) {
      formData.append("file", {
        uri: file.uri,
        name: file.name || "file",
        type: file.mimeType || "application/octet-stream",
      });
    }

    try {
      await createEvent(formData);
      alert("Event Created Successfully");
      clearForm();
      loadEvents(); // refresh events list
    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  const loadEvents = async () => {
    try {
      const allEvents = await fetchEvents();
      setEvents(allEvents);
    } catch (err) {
      console.error(err);
    }
  };

  const clearForm = () => {
    setName("");
    setStartDate("");
    setEndDate("");
    setTime("");
    setVenue("");
    setDescription("");
    setCategory("");
    setFile(null);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const openFile = (fileUrl) => {
    if (!fileUrl) return alert("No file attached");
    // replace with your backend IP and port if needed
    const url = `http://192.168.1.43:5000${fileUrl}`;
    Linking.openURL(url);
  };

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: colorScheme === "dark" ? "#121212" : "#f9f9f9" },
    input: {
      borderWidth: 1,
      padding: 10,
      marginVertical: 5,
      borderRadius: 5,
      borderColor: colorScheme === "dark" ? "#555" : "#ccc",
      backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
      color: colorScheme === "dark" ? "#fff" : "#000",
    },
    buttonContainer: { marginVertical: 5 },
    card: {
      padding: 10,
      borderWidth: 1,
      borderColor: colorScheme === "dark" ? "#555" : "#ccc",
      marginVertical: 5,
      borderRadius: 5,
      backgroundColor: colorScheme === "dark" ? "#222" : "#fff",
    },
    cardTitle: { fontWeight: "bold", color: colorScheme === "dark" ? "#fff" : "#000" },
    cardText: { color: colorScheme === "dark" ? "#ddd" : "#333" },
    headerText: { marginTop: 20, fontSize: 18, color: colorScheme === "dark" ? "#fff" : "#000" },
    fileButton: { marginTop: 5 },
  });

  return (
    <ScrollView style={styles.container}>
      <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="Time" value={time} onChangeText={setTime} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="Venue" value={venue} onChangeText={setVenue} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor={colorScheme === "dark" ? "#aaa" : "#888"} />

      <View style={styles.buttonContainer}>
        <Button title={file ? `Selected: ${file.name}` : "Pick File"} onPress={pickFile} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Submit Event" onPress={submitEvent} />
      </View>

      <Text style={styles.headerText}>All Events:</Text>
      {events.map((e) => (
        <View key={e._id} style={styles.card}>
          <Text style={styles.cardTitle}>{e.name} ({e.category})</Text>
          <Text style={styles.cardText}>{e.startDate} to {e.endDate}</Text>
          <Text style={styles.cardText}>{e.time}</Text>
          <Text style={styles.cardText}>{e.venue}</Text>
          <Text style={styles.cardText}>{e.description}</Text>
          {e.fileUrl && (
            <View style={styles.fileButton}>
              <Button title="View / Download File" onPress={() => openFile(e.fileUrl)} />
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
