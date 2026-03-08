import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../context/AppContext";

export default function SettingsScreen() {
  const { user, stats, refreshData } = useApp();

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data?",
      "This will delete all your sessions and rewards. This cannot be undone!",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear Data",
          style: "destructive",
          onPress: () => {
            // TODO: Implement clear data
            Alert.alert(
              "Feature Coming Soon",
              "Data clearing will be implemented soon!",
            );
          },
        },
      ],
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About OSHION",
      "OSHION - Digital Focus Regulator\n\nVersion 1.0.0\n\nBuild healthy focus habits and grow your ocean ecosystem!",
      [{ text: "OK" }],
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
        <Text style={styles.subtitle}>Manage your account and preferences</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileCard}>
          <Text style={styles.profileEmoji}>👤</Text>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user.username}</Text>
            <Text style={styles.profileId}>User ID: {user.userId}</Text>
          </View>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <View style={styles.card}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.sessionCount}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total Focus Time</Text>
            <Text style={styles.statValue}>{stats.totalMinutes} min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Avg Completion</Text>
            <Text style={styles.statValue}>{stats.avgCompletion}%</Text>
          </View>
        </View>
      </View>

      {/* App Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Settings</Text>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Notification settings coming soon!")
          }
        >
          <Text style={styles.settingLabel}>🔔 Notifications</Text>
          <Text style={styles.settingValue}>Enabled</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Theme settings coming soon!")
          }
        >
          <Text style={styles.settingLabel}>🎨 Theme</Text>
          <Text style={styles.settingValue}>Ocean Blue</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Sound settings coming soon!")
          }
        >
          <Text style={styles.settingLabel}>🔊 Sounds</Text>
          <Text style={styles.settingValue}>On</Text>
        </TouchableOpacity>
      </View>

      {/* Data Management */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>

        <TouchableOpacity style={styles.settingItem} onPress={refreshData}>
          <Text style={styles.settingLabel}>🔄 Refresh Data</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.settingItem, styles.dangerItem]}
          onPress={handleClearData}
        >
          <Text style={styles.dangerLabel}>🗑️ Clear All Data</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
          <Text style={styles.settingLabel}>ℹ️ About OSHION</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Help & Support coming soon!")
          }
        >
          <Text style={styles.settingLabel}>❓ Help & Support</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingItem}
          onPress={() =>
            Alert.alert("Coming Soon", "Privacy Policy coming soon!")
          }
        >
          <Text style={styles.settingLabel}>🔒 Privacy Policy</Text>
          <Text style={styles.settingValue}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>OSHION v1.0.0</Text>
        <Text style={styles.footerSubtext}>Made with 💙 for better focus</Text>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    backgroundColor: "#0077BE",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  section: {
    padding: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  profileCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileEmoji: {
    fontSize: 48,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 13,
    color: "#999",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0077BE",
  },
  settingItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  settingLabel: {
    fontSize: 15,
    color: "#333",
  },
  settingValue: {
    fontSize: 15,
    color: "#999",
  },
  dangerItem: {
    borderWidth: 1,
    borderColor: "#F44336",
  },
  dangerLabel: {
    fontSize: 15,
    color: "#F44336",
    fontWeight: "500",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 13,
    color: "#999",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#BBB",
  },
});
