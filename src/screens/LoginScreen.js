import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { createUser, loginUser } from "../services/database";

export default function LoginScreen({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    if (password.length < 4) {
      Alert.alert("Error", "Password must be at least 4 characters");
      return;
    }

    try {
      if (isLogin) {
        const user = await loginUser(username, password);
        onLoginSuccess(user);
      } else {
        const userId = await createUser(username, password);
        const user = { userId, username };
        onLoginSuccess(user);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A", "#2D1B69"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animatable.View animation="fadeInDown" style={styles.header}>
            <LinearGradient
              colors={["#667EEA", "#764BA2"]}
              style={styles.logoCircle}
            >
              <Text style={styles.logoEmoji}>🌊</Text>
            </LinearGradient>
            <Text style={styles.title}>OSHION</Text>
            <Text style={styles.subtitle}>Focus. Grow. Achieve.</Text>
          </Animatable.View>

          {/* Form Card */}
          <Animatable.View
            animation="fadeInUp"
            delay={300}
            style={styles.formCard}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]}
              style={styles.cardGradient}
            >
              {/* Toggle Tabs */}
              <View style={styles.tabContainer}>
                <TouchableOpacity
                  style={[styles.tab, isLogin && styles.tabActive]}
                  onPress={() => setIsLogin(true)}
                >
                  <Text
                    style={[styles.tabText, isLogin && styles.tabTextActive]}
                  >
                    Login
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, !isLogin && styles.tabActive]}
                  onPress={() => setIsLogin(false)}
                >
                  <Text
                    style={[styles.tabText, !isLogin && styles.tabTextActive]}
                  >
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Input Fields */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Username</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter username"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={username}
                    onChangeText={setUsername}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSubmit}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#667EEA", "#764BA2"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.submitGradient}
                >
                  <Text style={styles.submitText}>
                    {isLogin ? "Sign In" : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Info Text */}
              <Text style={styles.infoText}>
                {isLogin
                  ? "Don't have an account? Switch to Sign Up"
                  : "Already have an account? Switch to Login"}
              </Text>
            </LinearGradient>
          </Animatable.View>

          {/* Footer */}
          <Animatable.Text animation="fadeIn" delay={600} style={styles.footer}>
            Secure • Private • Focused
          </Animatable.Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  logoEmoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: "white",
    letterSpacing: 4,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 2,
  },
  formCard: {
    marginBottom: 30,
  },
  cardGradient: {
    borderRadius: 25,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 15,
    padding: 4,
    marginBottom: 30,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: "rgba(102, 126, 234, 0.3)",
  },
  tabText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 16,
    fontWeight: "600",
  },
  tabTextActive: {
    color: "white",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 15,
  },
  inputIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: "white",
    fontSize: 16,
    paddingVertical: 15,
  },
  submitButton: {
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  infoText: {
    textAlign: "center",
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
  },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.4)",
    fontSize: 12,
    letterSpacing: 2,
  },
});
