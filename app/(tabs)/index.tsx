import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../../src/context/AppContext";

export default function HomeScreen() {
  const router = useRouter();
  const { user, stats, todayStats, rewards, isLoading, isSessionActive } =
    useApp();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌊</Text>
      <Text style={styles.title}>OSHION</Text>
      <Text style={styles.subtitle}>Digital Focus Regulator</Text>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{todayStats.totalMinutes}</Text>
          <Text style={styles.statLabel}>min today</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.sessionCount}</Text>
          <Text style={styles.statLabel}>sessions</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{rewards.length}</Text>
          <Text style={styles.statLabel}>rewards</Text>
        </View>
      </View>

      {/* Start Focus Button */}
      <TouchableOpacity
        style={[
          styles.startButton,
          isSessionActive && styles.startButtonDisabled,
        ]}
        onPress={() => router.push("/focus-mode-selection")}
        disabled={isSessionActive}
      >
        <Text style={styles.startButtonIcon}>▶️</Text>
        <Text style={styles.startButtonText}>
          {isSessionActive ? "Session In Progress..." : "Start Focus Session"}
        </Text>
      </TouchableOpacity>

      {/* Recent Activity */}
      <View style={styles.activityBox}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <Text style={styles.activityText}>
          {stats.sessionCount > 0
            ? `Great job! You've completed ${stats.sessionCount} focus sessions.`
            : "Start your first focus session to begin building your ocean!"}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077BE",
    padding: 20,
    paddingTop: 60,
  },
  emoji: {
    fontSize: 60,
    textAlign: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 30,
  },
  loadingText: {
    color: "white",
    marginTop: 15,
    fontSize: 16,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  startButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonDisabled: {
    backgroundColor: "#CCC",
  },
  startButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0077BE",
  },
  activityBox: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 20,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  activityText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
  },
});
