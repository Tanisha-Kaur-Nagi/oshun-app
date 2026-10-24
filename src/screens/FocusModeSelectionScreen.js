import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { FOCUS_MODES } from "../utils/focusModes";

export default function FocusModeSelectionScreen() {
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState(null);
  const [customDuration, setCustomDuration] = useState("");

  const handleStartSession = () => {
    if (!selectedMode) {
      Alert.alert("Select Mode", "Please select a focus mode to continue");
      return;
    }

    let duration = selectedMode.duration;

    if (selectedMode.id === "custom") {
      const customMin = parseInt(customDuration);
      if (!customMin || customMin < 1 || customMin > 180) {
        Alert.alert(
          "Invalid Duration",
          "Please enter a duration between 1-180 minutes"
        );
        return;
      }
      duration = customMin;
    }

    router.push({
      pathname: "/active-focus",
      params: {
        modeId: selectedMode.id,
        modeName: selectedMode.name,
        modeIcon: selectedMode.icon,
        duration: duration,
      },
    });
  };

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A", "#2D1B69"]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Choose Your Focus Mode</Text>
          <Text style={styles.subtitle}>
            Select a mode to start your focus session
          </Text>
        </Animatable.View>

        {/* Mode Cards */}
        {FOCUS_MODES.map((mode, index) => (
          <Animatable.View
            key={mode.id}
            animation="fadeInUp"
            delay={index * 100}
          >
            <TouchableOpacity
              style={styles.modeCard}
              onPress={() => setSelectedMode(mode)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  selectedMode?.id === mode.id
                    ? ["rgba(102,126,234,0.4)", "rgba(118,75,162,0.4)"]
                    : ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.02)"]
                }
                style={[
                  styles.modeCardGradient,
                  selectedMode?.id === mode.id && styles.modeCardSelected,
                ]}
              >
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: mode.color },
                  ]}
                >
                  <Text style={styles.icon}>{mode.icon}</Text>
                </View>

                <View style={styles.modeInfo}>
                  <Text style={styles.modeName}>{mode.name}</Text>
                  <Text style={styles.modeDescription}>
                    {mode.description}
                  </Text>
                  {mode.id === "custom" && selectedMode?.id === "custom" ? (
                    <TextInput
                      style={styles.customInput}
                      placeholder="Enter minutes (1-180)"
                      placeholderTextColor="rgba(255,255,255,0.3)"
                      keyboardType="number-pad"
                      value={customDuration}
                      onChangeText={setCustomDuration}
                      maxLength={3}
                    />
                  ) : (
                    <Text style={styles.modeDuration}>
                      {mode.duration} minutes
                    </Text>
                  )}
                </View>

                {selectedMode?.id === mode.id && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        ))}

        {/* Start Button */}
        <Animatable.View animation="fadeInUp" delay={700}>
          <TouchableOpacity
            onPress={handleStartSession}
            activeOpacity={0.8}
            disabled={!selectedMode}
          >
            <LinearGradient
              colors={
                selectedMode
                  ? ["#667EEA", "#764BA2", "#F093FB"]
                  : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.startButton}
            >
              <Text style={styles.startButtonText}>
                {selectedMode ? "🚀 Start Focus Session" : "Select a Mode First"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 16,
    fontWeight: "600",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    letterSpacing: 0.5,
  },
  modeCard: {
    marginBottom: 14,
    borderRadius: 18,
    overflow: "hidden",
  },
  modeCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  modeCardSelected: {
    borderColor: "#667EEA",
    borderWidth: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 30,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },
  modeDuration: {
    fontSize: 13,
    fontWeight: "600",
    color: "#667EEA",
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#667EEA",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 8,
    color: "white",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#667EEA",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  checkmarkText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  startButton: {
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
});