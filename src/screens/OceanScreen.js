import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useApp } from "../context/AppContext";

const { width, height } = Dimensions.get("window");

export default function OceanScreen() {
  const { rewards, stats, sessions } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Floating animation for bubbles
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -20,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // Group rewards by level
  const rewardsByLevel = {
    full: rewards.filter((r) => r.reward_level === "full"),
    medium: rewards.filter((r) => r.reward_level === "medium"),
    small: rewards.filter((r) => r.reward_level === "small"),
  };

  const totalRewards = rewards.length;
  const oceanLevel = Math.min(Math.floor(totalRewards / 5) + 1, 10);

  return (
    <View style={styles.container}>
      {/* Animated Ocean Background */}
      <Animated.View
        style={[
          styles.oceanBackground,
          {
            opacity: fadeAnim,
            transform: [{ translateY: floatAnim }],
          },
        ]}
      >
        <Text style={styles.bubbles}>○ ○ ○</Text>
        <Text style={[styles.bubbles, { top: 100, left: width * 0.7 }]}>
          ○ ○
        </Text>
        <Text style={[styles.bubbles, { top: 150, left: width * 0.3 }]}>○</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Ocean Level */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <Text style={styles.title}>🌊 Your Ocean Ecosystem</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Level {oceanLevel}</Text>
          </View>
          <Text style={styles.subtitle}>
            {totalRewards === 0
              ? "Your ocean awaits..."
              : totalRewards === 1
                ? "1 coral blooming in your ocean"
                : `${totalRewards} corals blooming in your ocean`}
          </Text>
        </Animated.View>

        {/* Ocean Stats Card */}
        <Animated.View style={[styles.statsCard, { opacity: fadeAnim }]}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>🐠 Ocean Vitality</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{totalRewards}</Text>
              <Text style={styles.statLabel}>Corals</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{sessions.length}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>
                {Math.round(stats.avgCompletion)}%
              </Text>
              <Text style={styles.statLabel}>Avg Focus</Text>
            </View>
          </View>
        </Animated.View>

        {/* Ocean Floor - Main Coral Display */}
        <View style={styles.oceanFloor}>
          {totalRewards > 0 ? (
            <>
              {/* Full Corals */}
              {rewardsByLevel.full.length > 0 && (
                <CoralSection
                  title="Magnificent Coral Reefs"
                  emoji="🌺"
                  corals={rewardsByLevel.full}
                  color="#FFE5E5"
                  delay={100}
                />
              )}

              {/* Medium Corals */}
              {rewardsByLevel.medium.length > 0 && (
                <CoralSection
                  title="Growing Corals"
                  emoji="🪸"
                  corals={rewardsByLevel.medium}
                  color="#FFF3E0"
                  delay={200}
                />
              )}

              {/* Small Corals */}
              {rewardsByLevel.small.length > 0 && (
                <CoralSection
                  title="Young Coral Sprouts"
                  emoji="🌱"
                  corals={rewardsByLevel.small}
                  color="#E8F5E9"
                  delay={300}
                />
              )}

              {/* Marine Life Decoration */}
              <View style={styles.marineLife}>
                <Text style={styles.marineText}>🐠 🐡 🦀 🐚 🦑 🐙 🦈 🐟</Text>
              </View>
            </>
          ) : (
            <EmptyOcean />
          )}
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationCard}>
          <Text style={styles.motivationText}>
            {totalRewards === 0
              ? "🌊 Complete focus sessions to start growing your ocean ecosystem!"
              : totalRewards < 5
                ? "🌱 Your ocean is taking shape! Keep focusing to add more life."
                : totalRewards < 10
                  ? "🪸 Beautiful! Your coral reef is flourishing!"
                  : totalRewards < 20
                    ? "🌺 Amazing ecosystem! You're a focus master!"
                    : "🏆 Legendary ocean builder! Your focus is incredible!"}
          </Text>
        </View>

        {/* Achievement Badges */}
        {totalRewards > 0 && (
          <View style={styles.achievementsSection}>
            <Text style={styles.achievementsTitle}>🏆 Achievements</Text>
            <View style={styles.badgesContainer}>
              {totalRewards >= 1 && (
                <AchievementBadge title="First Coral" emoji="🌱" />
              )}
              {totalRewards >= 5 && (
                <AchievementBadge title="Reef Builder" emoji="🪸" />
              )}
              {totalRewards >= 10 && (
                <AchievementBadge title="Ocean Master" emoji="🌺" />
              )}
              {totalRewards >= 20 && (
                <AchievementBadge title="Marine Legend" emoji="🏆" />
              )}
              {stats.avgCompletion >= 80 && (
                <AchievementBadge title="Focus Expert" emoji="🎯" />
              )}
              {sessions.length >= 10 && (
                <AchievementBadge title="Dedicated" emoji="💪" />
              )}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Coral Section Component
function CoralSection({ title, emoji, corals, color, delay }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      delay: delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.coralSection, { opacity: fadeAnim }]}>
      <Text style={styles.coralSectionTitle}>
        {emoji} {title} ({corals.length})
      </Text>
      <View style={styles.coralGrid}>
        {corals.map((coral, index) => (
          <CoralCard
            key={coral.reward_id}
            emoji={emoji}
            color={color}
            index={index}
          />
        ))}
      </View>
    </Animated.View>
  );
}

// Individual Coral Card with Animation
function CoralCard({ emoji, color, index }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      delay: index * 50,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.coralCard,
        {
          backgroundColor: color,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.coralEmoji}>{emoji}</Text>
    </Animated.View>
  );
}

// Empty Ocean State
function EmptyOcean() {
  return (
    <View style={styles.emptyOcean}>
      <Text style={styles.emptyOceanEmoji}>🐚</Text>
      <Text style={styles.emptyOceanTitle}>Empty Ocean</Text>
      <Text style={styles.emptyOceanText}>
        Your ocean is waiting to bloom!{"\n"}
        Complete focus sessions to grow beautiful corals.
      </Text>
      <View style={styles.emptyOceanHint}>
        <Text style={styles.hintText}>
          💡 Tip: Higher completion % = Better corals!
        </Text>
      </View>
    </View>
  );
}

// Achievement Badge Component
function AchievementBadge({ title, emoji }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 100,
      friction: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[styles.achievementBadge, { transform: [{ scale: scaleAnim }] }]}
    >
      <Text style={styles.badgeEmoji}>{emoji}</Text>
      <Text style={styles.badgeTitle}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077BE",
  },
  oceanBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 300,
    justifyContent: "center",
    alignItems: "center",
  },
  bubbles: {
    position: "absolute",
    fontSize: 24,
    color: "rgba(255, 255, 255, 0.3)",
    top: 50,
    left: width * 0.2,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  levelBadge: {
    backgroundColor: "rgba(255, 215, 0, 0.9)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 12,
  },
  levelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0077BE",
  },
  subtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  statsHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  statBox: {
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
  oceanFloor: {
    backgroundColor: "rgba(255,255,255,0.98)",
    marginHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    minHeight: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  coralSection: {
    marginBottom: 30,
  },
  coralSectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0077BE",
    marginBottom: 15,
  },
  coralGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  coralCard: {
    width: (width - 80) / 3.5,
    height: (width - 80) / 3.5,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
  },
  coralEmoji: {
    fontSize: 36,
  },
  marineLife: {
    marginTop: 30,
    padding: 20,
    backgroundColor: "rgba(0, 119, 190, 0.05)",
    borderRadius: 16,
    alignItems: "center",
  },
  marineText: {
    fontSize: 28,
    letterSpacing: 8,
  },
  emptyOcean: {
    alignItems: "center",
    paddingVertical: 80,
    paddingHorizontal: 40,
  },
  emptyOceanEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyOceanTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0077BE",
    marginBottom: 12,
  },
  emptyOceanText: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  emptyOceanHint: {
    backgroundColor: "#FFF3CD",
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  hintText: {
    fontSize: 13,
    color: "#856404",
    fontWeight: "500",
  },
  motivationCard: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#4CAF50",
    shadowColor: "#4CAF50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  motivationText: {
    fontSize: 15,
    color: "#2E7D32",
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "500",
  },
  achievementsSection: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
  },
  achievementsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077BE",
    marginBottom: 16,
    textAlign: "center",
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 12,
  },
  achievementBadge: {
    backgroundColor: "#FFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    minWidth: 100,
    borderWidth: 2,
    borderColor: "#FFD700",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  badgeEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  badgeTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
});
