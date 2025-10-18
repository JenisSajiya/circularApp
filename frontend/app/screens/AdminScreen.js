// frontend/app/screens/AdminScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  TouchableOpacity,
  Animated,
  Easing,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { fetchEvents, createEvent, getToken, manageAdmin } from "../api";
import { useNavigation } from "@react-navigation/native";

export default function AdminScreen() {
  const navigation = useNavigation();

  // Event States
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [time, setTime] = useState("");
  const [venue, setVenue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Admin Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [action, setAction] = useState("grant"); // "grant" or "revoke"
  const slideAnim = useState(new Animated.Value(300))[0]; // start below screen

  // Header Right Button
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={openModal} style={{ marginRight: 15 }}>
          <Text style={{ color: "#1E90FF", fontWeight: "bold" }}>Edit Permission</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const openModal = () => {
    setModalVisible(true);
    slideAnim.setValue(300);
    Animated.timing(slideAnim, {
      toValue: 110, // top position on screen
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const closeModal = () => {
    Animated.timing(slideAnim, {
      toValue: 300,
      duration: 200,
      easing: Easing.in(Easing.ease),
      useNativeDriver: false,
    }).start(() => setModalVisible(false));
  };

  // Event Submission
  const submitEvent = async () => {
    if (!name || !startDate || !endDate || !time || !venue) {
      return Alert.alert("Validation", "Please fill required fields.");
    }
    if (fileUrl && !/^https?:\/\/.+$/.test(fileUrl)) {
      return Alert.alert("Invalid URL", "Enter a valid http(s) URL.");
    }
    try {
      const token = await getToken();
      if (!token) return Alert.alert("Unauthorized", "Login again");
      await createEvent({ name, startDate, endDate, time, venue, description, category, fileUrl });
      Alert.alert("Success", "Event Created Successfully");
      clearForm();
      loadEvents();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.message || "Failed to create event");
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
    setName(""); setStartDate(""); setEndDate(""); setTime(""); setVenue("");
    setDescription(""); setCategory(""); setFileUrl("");
  };

  const openUrl = async (url) => {
    if (!url) return Alert.alert("No file attached");
    const supported = await Linking.canOpenURL(url);
    if (supported) await Linking.openURL(url);
    else Alert.alert("Cannot open URL");
  };

  // Handle Grant/Revoke Admin
  const handlePermission = async () => {
    if (!email) return Alert.alert("Validation", "Please enter email");
    try {
      const token = await getToken();
      if (!token) return Alert.alert("Unauthorized", "Login again");

      // debug log
      console.log("manageAdmin called:", { email, action, token: !!token });

      const res = await manageAdmin({ email, action }, token);
      console.log("manageAdmin result:", res);
      Alert.alert("Success", res.message || "Updated role");
      setEmail("");
      closeModal();
    } catch (err) {
      console.error("handlePermission error:", err);
      Alert.alert("Error", err.message || "Failed to update role");
    }
  };

  // Filtered Events
  const filteredEvents = events.filter((e) => {
    const today = new Date();
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    if (filter === "ongoing" && !(start <= today && end >= today)) return false;
    if (filter === "upcoming" && !(start > today)) return false;
    if (filter === "past" && !(end < today)) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return e.name?.toLowerCase().includes(q) ||
           e.venue?.toLowerCase().includes(q) ||
           e.description?.toLowerCase().includes(q) ||
           e.category?.toLowerCase().includes(q) ||
           e.time?.toLowerCase().includes(q);
  });

  const isOngoing = (e) => {
    const today = new Date();
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return start <= today && end >= today;
  };

  const styles = StyleSheet.create({
    root: { flex: 1, position: "relative", backgroundColor: "#fff" }, // important: relative positioning
    container: { flex: 1, padding: 20 },
    input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5, borderColor: "#ccc", color: "#000" },
    buttonContainer: { marginVertical: 5 },
    card: { padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 5, marginVertical: 5, backgroundColor: "#fff" },
    cardTitle: { fontWeight: "bold", color: "#000" },
    cardText: { color: "#333" },
    headerText: { marginTop: 20, fontSize: 18, color: "#000" },
    picker: { marginVertical: 10, borderWidth: 1, borderColor: "#ccc" },
    linkText: { color: "#1E90FF", textDecorationLine: "underline" },
    modalPanel: {
      position: "absolute",
      right: 10,
      width: 320,
      backgroundColor: "#fff",
      borderRadius: 10,
      padding: 15,
      shadowColor: "#000",
      shadowOpacity: 0.25,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 5,
      elevation: 20,
      zIndex: 1000,
    },
    modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    fab: {
      position: "absolute",
      bottom: 30,
      right: 20,
      backgroundColor: "#1E90FF",
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 8,
      zIndex: 1000,
    },
    smallBtn: {
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 6,
      minWidth: 120,
      alignItems: "center",
    },
    grantBtn: { backgroundColor: "#1E90FF" },
    revokeBtn: { backgroundColor: "#FF6347" },
    smallBtnText: { color: "#fff", fontWeight: "600" },
  });

  return (
    <View style={styles.root}>
      {/* ScrollView should not block overlay touches: pointerEvents box-none */}
      <ScrollView style={styles.container} pointerEvents="box-none" contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Event Form */}
        <TextInput placeholder="Event Name" value={name} onChangeText={setName} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Start Date (YYYY-MM-DD)" value={startDate} onChangeText={setStartDate} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="End Date (YYYY-MM-DD)" value={endDate} onChangeText={setEndDate} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Time" value={time} onChangeText={setTime} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Venue" value={venue} onChangeText={setVenue} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={styles.input} placeholderTextColor="#888" />
        <TextInput placeholder="Google Drive URL (optional)" value={fileUrl} onChangeText={setFileUrl} style={styles.input} placeholderTextColor="#888" autoCapitalize="none" />

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={submitEvent} style={[styles.smallBtn, styles.grantBtn]}>
            <Text style={styles.smallBtnText}>Submit Event</Text>
          </TouchableOpacity>
        </View>

        {/* Search */}
        <TextInput placeholder="Search events..." value={searchQuery} onChangeText={setSearchQuery} style={styles.input} placeholderTextColor="#888" />

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
            <View key={e._id} style={[styles.card, isOngoing(e) && { borderColor: "#1E90FF", borderWidth: 2, backgroundColor: "#E0F0FF" }]}>
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

      {/* Floating Admin Button */}
      <TouchableOpacity style={styles.fab} onPress={openModal}>
        <Text style={{ color: "#fff", fontWeight: "bold" }}>⚙️</Text>
      </TouchableOpacity>

      {/* Modal Panel (overlay) */}
      {modalVisible && (
        <Animated.View style={[styles.modalPanel, { top: slideAnim }]}>
          <Text style={styles.modalTitle}>Edit Admin Permission</Text>

          <TextInput
            placeholder="Enter user email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={{ flexDirection: "row", justifyContent: "space-around", marginBottom: 10 }}>
            <TouchableOpacity
              onPress={() => { console.log("Grant pressed"); setAction("grant"); }}
              style={[styles.smallBtn, action === "grant" ? styles.grantBtn : {}]}
            >
              <Text style={styles.smallBtnText}>Grant Admin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => { console.log("Revoke pressed"); setAction("revoke"); }}
              style={[styles.smallBtn, action === "revoke" ? styles.revokeBtn : {}]}
            >
              <Text style={styles.smallBtnText}>Revoke Admin</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity onPress={handlePermission} style={[styles.smallBtn, styles.grantBtn]}>
              <Text style={styles.smallBtnText}>Submit</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={closeModal} style={[styles.smallBtn, { backgroundColor: "#888" }]}>
              <Text style={styles.smallBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}
    </View>
  );
}
