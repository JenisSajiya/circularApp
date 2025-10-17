// frontend/app/screens/HomeScreen.js
import React, { useState } from "react";
import { 
  View, Text, TextInput, Button, Alert, StyleSheet, ScrollView, TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { BACKEND_URL } from "../api";

export default function HomeScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true); // toggle login/signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password || (!isLogin && !name)) {
      return Alert.alert("Validation", "Please fill all required fields");
    }

    const url = `${BACKEND_URL}/api/auth/${isLogin ? "login" : "signup"}`;
    const body = isLogin ? { email, password } : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // read raw text first (handles HTML error pages)
      const raw = await res.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch (parseErr) {
        // Not JSON - use raw text as message
        data = { message: raw };
      }

      if (!res.ok) {
        const msg = data.message || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      if (isLogin) {
        // Save token if needed (AsyncStorage or context)
        // Redirect based on role
        if (data.role === "admin") {
          router.replace("/(tabs)/admin");
        } else {
          router.replace("/(tabs)/explore");
        }
      } else {
        Alert.alert("Signup Successful", "You can now log in");
        setIsLogin(true);
      }
    } catch (err) {
      console.error("Auth error:", err);
      Alert.alert("Error", err.message || "Something went wrong");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isLogin ? "Login" : "Signup"}</Text>

      {!isLogin && (
        <TextInput
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholderTextColor="#888"
        />
      )}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        placeholderTextColor="#888"
      />

      <View style={styles.buttonContainer}>
        <Button 
          title={isLogin ? "Login" : "Signup"} 
          onPress={handleAuth} 
          color="#1E90FF"
        />
      </View>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.toggleText}>
          {isLogin ? "Don't have an account? Signup" : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff" 
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, color: "#000", textAlign: "center" },
  input: { borderWidth: 1, padding: 12, borderRadius: 5, borderColor: "#ccc", marginVertical: 8, color: "#000" },
  buttonContainer: { marginVertical: 10 },
  toggleText: { textAlign: "center", color: "#1E90FF", marginTop: 15 },
});
