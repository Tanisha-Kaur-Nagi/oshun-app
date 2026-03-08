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

    // If custom mode, use custom duration
    if (selectedMode.id === "custom") {
      const customMin = parseInt(customDuration);
      if (!customMin || customMin < 1 || customMin > 180) {
        Alert.alert(
          "Invalid Duration",
          "Please enter a duration between 1-180 minutes",
        );
        return;
      }
      duration = customMin;
    }

    // Navigate to active focus screen with mode data
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Focus Mode</Text>
        <Text style={styles.subtitle}>
          Select a mode to start your focus session
        </Text>
      </View>

      {FOCUS_MODES.map((mode) => (
        <TouchableOpacity
          key={mode.id}
          style={[
            styles.modeCard,
            selectedMode?.id === mode.id && styles.modeCardSelected,
          ]}
          onPress={() => setSelectedMode(mode)}
        >
          <View style={[styles.iconContainer, { backgroundColor: mode.color }]}>
            <Text style={styles.icon}>{mode.icon}</Text>
          </View>

          <View style={styles.modeInfo}>
            <Text style={styles.modeName}>{mode.name}</Text>
            <Text style={styles.modeDescription}>{mode.description}</Text>
            {mode.id === "custom" && selectedMode?.id === "custom" ? (
              <TextInput
                style={styles.customInput}
                placeholder="Enter minutes (1-180)"
                keyboardType="number-pad"
                value={customDuration}
                onChangeText={setCustomDuration}
                maxLength={3}
              />
            ) : (
              <Text style={styles.modeDuration}>{mode.duration} minutes</Text>
            )}
          </View>

          {selectedMode?.id === mode.id && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={[
          styles.startButton,
          !selectedMode && styles.startButtonDisabled,
        ]}
        onPress={handleStartSession}
        disabled={!selectedMode}
      >
        <Text style={styles.startButtonText}>Start Focus Session</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#0077BE",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  modeCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeCardSelected: {
    borderColor: "#4CAF50",
    backgroundColor: "#F1F8F4",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 13,
    color: "#666",
    marginBottom: 6,
  },
  modeDuration: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0077BE",
  },
  customInput: {
    borderWidth: 1,
    borderColor: "#0077BE",
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    marginTop: 8,
  },
  checkmark: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
  },
  checkmarkText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  startButton: {
    backgroundColor: "#0077BE",
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  startButtonDisabled: {
    backgroundColor: "#CCC",
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 40,
  },
  cancelText: {
    color: "#666",
    fontSize: 16,
  },
});
