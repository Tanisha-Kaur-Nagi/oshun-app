import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useApp } from "../../src/context/AppContext";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, stats, todayStats, todayGoal, streak } = useApp();

  const goalProgress = todayGoal
    ? Math.min(
        (todayGoal.achieved_minutes / todayGoal.target_minutes) * 100,
        100,
      )
    : 0;

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
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.username}>{user.username} 👋</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <LinearGradient
              colors={["#667EEA", "#764BA2"]}
              style={styles.profileGradient}
            >
              <Text style={styles.profileEmoji}>🌊</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Daily Goal Card */}
        <Animatable.View
          animation="fadeInUp"
          delay={200}
          style={styles.goalCard}
        >
          <LinearGradient
            colors={["rgba(102,126,234,0.2)", "rgba(118,75,162,0.2)"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.goalGradient}
          >
            <View style={styles.goalHeader}>
              <Text style={styles.goalTitle}>Today's Goal</Text>
              <TouchableOpacity onPress={() => router.push("/goal-settings")}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.goalStats}>
              <Text style={styles.goalValue}>
                {todayGoal?.achieved_minutes || 0} /{" "}
                {todayGoal?.target_minutes || 60}
              </Text>
              <Text style={styles.goalLabel}>minutes</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={["#667EEA", "#764BA2", "#F093FB"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${goalProgress}%` }]}
              />
            </View>
            <Text style={styles.progressText}>
              {Math.round(goalProgress)}% Complete
            </Text>
          </LinearGradient>
        </Animatable.View>

        {/* Stats Grid */}
        <Animatable.View animation="fadeInUp" delay={300}>
          <View style={styles.statsGrid}>
            {/* Stat 1 - Today */}
            <LinearGradient
              colors={["#667EEA", "#764BA2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{todayStats.sessionCount}</Text>
              <Text style={styles.statLabel}>Today Sessions</Text>
            </LinearGradient>

            {/* Stat 2 - Streak */}
            <LinearGradient
              colors={["#F093FB", "#F5576C"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>⚡</Text>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>

            {/* Stat 3 - Total Time */}
            <LinearGradient
              colors={["#4FACFE", "#00F2FE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Total Minutes</Text>
            </LinearGradient>

            {/* Stat 4 - Avg Completion */}
            <LinearGradient
              colors={["#43E97B", "#38F9D7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>🎯</Text>
              <Text style={styles.statValue}>{stats.avgCompletion}%</Text>
              <Text style={styles.statLabel}>Avg Focus</Text>
            </LinearGradient>
          </View>
        </Animatable.View>

        {/* Main Action Button */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <TouchableOpacity
            style={styles.mainButton}
            onPress={() => router.push("/focus-mode-selection")}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={["#667EEA", "#764BA2", "#F093FB"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.mainButtonGradient}
            >
              <Text style={styles.mainButtonIcon}>🚀</Text>
              <Text style={styles.mainButtonText}>Start Focus Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Quick Actions */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/achievements")}
            >
              <LinearGradient
                colors={["rgba(255,215,0,0.2)", "rgba(255,140,0,0.2)"]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🏆</Text>
                <Text style={styles.quickActionText}>Achievements</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/analytics")}
            >
              <LinearGradient
                colors={["rgba(102,126,234,0.2)", "rgba(118,75,162,0.2)"]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>📊</Text>
                <Text style={styles.quickActionText}>Analytics</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickAction}
              onPress={() => router.push("/app-selection")}
            >
              <LinearGradient
                colors={["rgba(245,87,108,0.2)", "rgba(240,147,251,0.2)"]}
                style={styles.quickActionGradient}
              >
                <Text style={styles.quickActionIcon}>🚫</Text>
                <Text style={styles.quickActionText}>Block Apps</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animatable.View>

        <View style={{ height: 30 }} />
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
  },
  greeting: {
    fontSize: 16,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 4,
  },
  username: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  profileButton: {
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  profileGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  profileEmoji: {
    fontSize: 24,
  },
  goalCard: {
    marginBottom: 25,
  },
  goalGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  editButton: {
    color: "#667EEA",
    fontSize: 14,
    fontWeight: "600",
  },
  goalStats: {
    alignItems: "center",
    marginBottom: 15,
  },
  goalValue: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
  },
  goalLabel: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginTop: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 25,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  statEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  mainButton: {
    marginBottom: 30,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  mainButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 12,
  },
  mainButtonIcon: {
    fontSize: 28,
  },
  mainButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
  },
  quickActions: {
    flexDirection: "row",
    gap: 12,
  },
  quickAction: {
    flex: 1,
  },
  quickActionGradient: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
});
