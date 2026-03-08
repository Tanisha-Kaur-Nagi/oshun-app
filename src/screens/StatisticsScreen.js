import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useApp } from "../context/AppContext";

export default function StatisticsScreen() {
  const { stats, todayStats, sessions, rewards } = useApp();

  // Calculate streak (simplified - consecutive days)
  const currentStreak = 3; // TODO: Calculate from sessions

  // Get recent sessions (last 5)
  const recentSessions = sessions.slice(0, 5);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Statistics</Text>
        <Text style={styles.subtitle}>Track your focus journey</Text>
      </View>

      {/* Today's Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📅 Today</Text>
        <View style={styles.card}>
          <View style={styles.cardRow}>
            <View style={styles.cardItem}>
              <Text style={styles.cardValue}>{todayStats.sessionCount}</Text>
              <Text style={styles.cardLabel}>Sessions</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.cardItem}>
              <Text style={styles.cardValue}>{todayStats.totalMinutes}</Text>
              <Text style={styles.cardLabel}>Minutes</Text>
            </View>
          </View>
        </View>
      </View>

      {/* All Time Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 All Time</Text>
        <View style={styles.card}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Sessions</Text>
            <Text style={styles.statValue}>{stats.sessionCount}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Total Focus Time</Text>
            <Text style={styles.statValue}>{stats.totalMinutes} min</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Avg Completion</Text>
            <Text style={styles.statValue}>{stats.avgCompletion}%</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Rewards Earned</Text>
            <Text style={styles.statValue}>{rewards.length}</Text>
          </View>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Current Streak</Text>
            <Text style={styles.statValue}>{currentStreak} days 🔥</Text>
          </View>
        </View>
      </View>

      {/* Recent Sessions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📝 Recent Sessions</Text>
        {recentSessions.length > 0 ? (
          recentSessions.map((session) => (
            <View key={session.session_id} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionMode}>{session.focus_mode}</Text>
                <Text style={styles.sessionPercentage}>
                  {Math.round(session.completion_percentage)}%
                </Text>
              </View>
              <View style={styles.sessionDetails}>
                <Text style={styles.sessionText}>
                  {session.actual_duration} / {session.planned_duration} min
                </Text>
                <Text style={styles.sessionDate}>
                  {new Date(session.start_time).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${session.completion_percentage}%`,
                      backgroundColor:
                        session.completion_percentage >= 90
                          ? "#4CAF50"
                          : session.completion_percentage >= 50
                            ? "#FF9800"
                            : "#F44336",
                    },
                  ]}
                />
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No sessions yet</Text>
            <Text style={styles.emptySubtext}>
              Start a focus session to see your stats!
            </Text>
          </View>
        )}
      </View>

      {/* Insights */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 Insights</Text>
        <View style={styles.card}>
          <Text style={styles.insightText}>
            {stats.sessionCount === 0
              ? "🌊 Start your first focus session to unlock insights!"
              : stats.avgCompletion >= 80
                ? "🎉 Amazing! You have great focus consistency!"
                : stats.avgCompletion >= 50
                  ? "👍 Good progress! Try to reduce distractions for better completion rates."
                  : "💪 Keep going! Every session helps build better focus habits."}
          </Text>
        </View>
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
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
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cardItem: {
    alignItems: "center",
    flex: 1,
  },
  cardValue: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0077BE",
  },
  cardLabel: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: "#E0E0E0",
  },
  statRow: {
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
    color: "#333",
  },
  sessionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sessionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sessionMode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  sessionPercentage: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0077BE",
  },
  sessionDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sessionText: {
    fontSize: 13,
    color: "#666",
  },
  sessionDate: {
    fontSize: 13,
    color: "#999",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  emptyState: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#999",
  },
  insightText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
