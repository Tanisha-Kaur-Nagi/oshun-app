import React, { useMemo } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { useApp } from "../context/AppContext";

const { width } = Dimensions.get("window");

export default function StatisticsScreen() {
  const { stats, todayStats, sessions, rewards } = useApp();

  // Calculate weekly data (last 7 days)
  const weeklyData = useMemo(() => {
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const daySessions = sessions.filter(
        (s) => s.start_time.split("T")[0] === dateStr,
      );

      const totalMinutes = daySessions.reduce(
        (sum, s) => sum + s.actual_duration,
        0,
      );

      last7Days.push({
        value: totalMinutes,
        label: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
        frontColor: totalMinutes > 0 ? "#4CAF50" : "#E0E0E0",
      });
    }

    return last7Days;
  }, [sessions]);

  // Calculate completion rate distribution
  const completionDistribution = useMemo(() => {
    const ranges = {
      excellent: 0, // 90-100%
      good: 0, // 70-89%
      fair: 0, // 50-69%
      poor: 0, // <50%
    };

    sessions.forEach((s) => {
      const pct = s.completion_percentage;
      if (pct >= 90) ranges.excellent++;
      else if (pct >= 70) ranges.good++;
      else if (pct >= 50) ranges.fair++;
      else ranges.poor++;
    });

    return [
      { value: ranges.excellent, color: "#4CAF50", text: "90-100%" },
      { value: ranges.good, color: "#8BC34A", text: "70-89%" },
      { value: ranges.fair, color: "#FFC107", text: "50-69%" },
      { value: ranges.poor, color: "#F44336", text: "<50%" },
    ].filter((item) => item.value > 0);
  }, [sessions]);

  // Focus modes distribution
  const modeDistribution = useMemo(() => {
    const modes = {};
    sessions.forEach((s) => {
      modes[s.focus_mode] = (modes[s.focus_mode] || 0) + 1;
    });

    const colors = [
      "#2196F3",
      "#4CAF50",
      "#FF9800",
      "#9C27B0",
      "#F44336",
      "#00BCD4",
    ];
    return Object.entries(modes).map(([mode, count], index) => ({
      value: count,
      color: colors[index % colors.length],
      text: mode,
    }));
  }, [sessions]);

  // Calculate streak
  const currentStreak = useMemo(() => {
    if (sessions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split("T")[0];

      const hasSession = sessions.some(
        (s) => s.start_time.split("T")[0] === dateStr,
      );

      if (hasSession) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return streak;
  }, [sessions]);

  // Recent sessions
  const recentSessions = sessions.slice(0, 5);

  // Best session
  const bestSession = useMemo(() => {
    if (sessions.length === 0) return null;
    return sessions.reduce((best, current) =>
      current.completion_percentage > best.completion_percentage
        ? current
        : best,
    );
  }, [sessions]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>📊 Statistics</Text>
        <Text style={styles.subtitle}>Your focus journey at a glance</Text>
      </View>

      {/* Key Metrics Cards */}
      <View style={styles.metricsContainer}>
        <MetricCard
          icon="🔥"
          value={currentStreak}
          label="Day Streak"
          color="#FF6B6B"
        />
        <MetricCard
          icon="⏱️"
          value={stats.totalMinutes}
          label="Total Min"
          color="#4ECDC4"
        />
        <MetricCard
          icon="✅"
          value={`${stats.avgCompletion}%`}
          label="Avg Rate"
          color="#95E1D3"
        />
        <MetricCard
          icon="🌊"
          value={rewards.length}
          label="Rewards"
          color="#FFD93D"
        />
      </View>

      {/* Weekly Focus Chart */}
      {sessions.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>📈 Weekly Focus Time</Text>
            <Text style={styles.chartSubtitle}>Last 7 days (minutes)</Text>
          </View>
          <View style={styles.chartContainer}>
            <BarChart
              data={weeklyData}
              width={width - 80}
              height={200}
              barWidth={30}
              spacing={12}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={styles.chartAxisText}
              noOfSections={4}
              maxValue={Math.max(...weeklyData.map((d) => d.value)) + 20}
            />
          </View>
        </View>
      )}

      {/* Completion Rate Distribution */}
      {completionDistribution.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>
              🎯 Completion Rate Distribution
            </Text>
            <Text style={styles.chartSubtitle}>Session quality breakdown</Text>
          </View>
          <View style={styles.pieChartContainer}>
            <PieChart
              data={completionDistribution}
              donut
              radius={80}
              innerRadius={50}
              centerLabelComponent={() => (
                <View style={styles.pieCenter}>
                  <Text style={styles.pieCenterValue}>{sessions.length}</Text>
                  <Text style={styles.pieCenterLabel}>Sessions</Text>
                </View>
              )}
            />
            <View style={styles.pieLegend}>
              {completionDistribution.map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.legendText}>
                    {item.text}: {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}

      {/* Focus Modes Distribution */}
      {modeDistribution.length > 0 && (
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>📚 Focus Modes</Text>
            <Text style={styles.chartSubtitle}>Your preferred modes</Text>
          </View>
          <View style={styles.modeList}>
            {modeDistribution.map((mode, index) => (
              <View key={index} style={styles.modeItem}>
                <View style={styles.modeLeft}>
                  <View
                    style={[styles.modeDot, { backgroundColor: mode.color }]}
                  />
                  <Text style={styles.modeText}>{mode.text}</Text>
                </View>
                <View style={styles.modeRight}>
                  <View
                    style={[
                      styles.modeBar,
                      {
                        width: `${(mode.value / sessions.length) * 100}%`,
                        backgroundColor: mode.color,
                      },
                    ]}
                  />
                  <Text style={styles.modeValue}>{mode.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Best Session Card */}
      {bestSession && (
        <View style={styles.bestSessionCard}>
          <Text style={styles.bestSessionTitle}>🏆 Best Session</Text>
          <View style={styles.bestSessionContent}>
            <View style={styles.bestSessionLeft}>
              <Text style={styles.bestSessionMode}>
                {bestSession.focus_mode}
              </Text>
              <Text style={styles.bestSessionDate}>
                {new Date(bestSession.start_time).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.bestSessionRight}>
              <Text style={styles.bestSessionPercentage}>
                {Math.round(bestSession.completion_percentage)}%
              </Text>
              <Text style={styles.bestSessionDuration}>
                {bestSession.actual_duration} min
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Recent Sessions</Text>
          {recentSessions.map((session) => (
            <SessionCard key={session.session_id} session={session} />
          ))}
        </View>
      )}

      {/* Insights */}
      <View style={styles.insightsCard}>
        <Text style={styles.insightsTitle}>💡 Insights</Text>
        <InsightsList
          streak={currentStreak}
          avgCompletion={stats.avgCompletion}
          sessionCount={stats.sessionCount}
          totalMinutes={stats.totalMinutes}
        />
      </View>

      {/* Empty State */}
      {sessions.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📊</Text>
          <Text style={styles.emptyTitle}>No Statistics Yet</Text>
          <Text style={styles.emptyText}>
            Complete your first focus session to see beautiful charts and
            insights!
          </Text>
        </View>
      )}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

// Metric Card Component
function MetricCard({ icon, value, label, color }) {
  return (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <Text style={styles.metricIcon}>{icon}</Text>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  );
}

// Session Card Component
function SessionCard({ session }) {
  const getColor = (percentage) => {
    if (percentage >= 90) return "#4CAF50";
    if (percentage >= 70) return "#8BC34A";
    if (percentage >= 50) return "#FFC107";
    return "#F44336";
  };

  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <Text style={styles.sessionMode}>{session.focus_mode}</Text>
        <Text
          style={[
            styles.sessionPercentage,
            { color: getColor(session.completion_percentage) },
          ]}
        >
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
              backgroundColor: getColor(session.completion_percentage),
            },
          ]}
        />
      </View>
    </View>
  );
}

// Insights List Component
function InsightsList({ streak, avgCompletion, sessionCount, totalMinutes }) {
  const insights = [];

  if (streak >= 7) {
    insights.push({
      icon: "🔥",
      text: `Amazing ${streak}-day streak! You're on fire!`,
    });
  } else if (streak >= 3) {
    insights.push({ icon: "💪", text: `${streak}-day streak! Keep it going!` });
  }

  if (avgCompletion >= 90) {
    insights.push({
      icon: "⭐",
      text: "Excellent focus consistency! You're a master!",
    });
  } else if (avgCompletion >= 70) {
    insights.push({
      icon: "👍",
      text: "Great completion rate! You're doing well!",
    });
  }

  if (totalMinutes >= 300) {
    insights.push({
      icon: "🎯",
      text: `${totalMinutes} minutes of pure focus. Incredible!`,
    });
  }

  if (sessionCount >= 20) {
    insights.push({
      icon: "🏆",
      text: `${sessionCount} sessions completed! You're dedicated!`,
    });
  }

  if (insights.length === 0) {
    insights.push({ icon: "🌱", text: "Keep focusing to unlock insights!" });
  }

  return (
    <View style={styles.insightsList}>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightItem}>
          <Text style={styles.insightIcon}>{insight.icon}</Text>
          <Text style={styles.insightText}>{insight.text}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#0077BE",
    padding: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },
  metricsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: (width - 48) / 2,
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  metricIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 13,
    color: "#999",
  },
  chartContainer: {
    alignItems: "center",
  },
  chartAxisText: {
    fontSize: 10,
    color: "#999",
  },
  pieChartContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  pieCenter: {
    alignItems: "center",
  },
  pieCenterValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  pieCenterLabel: {
    fontSize: 12,
    color: "#999",
  },
  pieLegend: {
    gap: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 13,
    color: "#666",
  },
  modeList: {
    gap: 12,
  },
  modeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  modeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modeText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  modeRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  modeBar: {
    height: 8,
    borderRadius: 4,
  },
  modeValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
    minWidth: 20,
    textAlign: "right",
  },
  bestSessionCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  bestSessionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  bestSessionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bestSessionLeft: {
    flex: 1,
  },
  bestSessionMode: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  bestSessionDate: {
    fontSize: 13,
    color: "#999",
  },
  bestSessionRight: {
    alignItems: "flex-end",
  },
  bestSessionPercentage: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  bestSessionDuration: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  sessionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
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
  insightsCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 12,
  },
  insightIcon: {
    fontSize: 24,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#666",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    lineHeight: 20,
  },
});
