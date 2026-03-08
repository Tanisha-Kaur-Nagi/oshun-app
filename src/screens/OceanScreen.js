import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

export default function OceanScreen() {
  const { rewards, stats } = useApp();

  // Group rewards by level
  const rewardsByLevel = {
    full: rewards.filter(r => r.reward_level === 'full'),
    medium: rewards.filter(r => r.reward_level === 'medium'),
    small: rewards.filter(r => r.reward_level === 'small'),
  };

  return (
    <View style={styles.container}>
      {/* Ocean Background */}
      <View style={styles.oceanBackground}>
        <Text style={styles.waves}>🌊</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Your Ocean Ecosystem</Text>
          <Text style={styles.subtitle}>
            {rewards.length > 0
              ? `You've earned ${rewards.length} rewards!`
              : 'Start focusing to grow your ocean'}
          </Text>
        </View>

        {/* Stats Card */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>🌊 Ocean Stats</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{rewards.length}</Text>
              <Text style={styles.statLabel}>Total Corals</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.sessionCount}</Text>
              <Text style={styles.statLabel}>Sessions</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </View>

        {/* Rewards Display */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>Your Coral Collection</Text>

          {/* Full Corals */}
          {rewardsByLevel.full.length > 0 && (
            <View style={styles.rewardGroup}>
              <Text style={styles.rewardGroupTitle}>
                🌺 Full Coral Reefs ({rewardsByLevel.full.length})
              </Text>
              <View style={styles.coralGrid}>
                {rewardsByLevel.full.map((reward, index) => (
                  <View key={reward.reward_id} style={[styles.coral, styles.coralFull]}>
                    <Text style={styles.coralEmoji}>🌺</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Medium Corals */}
          {rewardsByLevel.medium.length > 0 && (
            <View style={styles.rewardGroup}>
              <Text style={styles.rewardGroupTitle}>
                🪸 Medium Corals ({rewardsByLevel.medium.length})
              </Text>
              <View style={styles.coralGrid}>
                {rewardsByLevel.medium.map((reward, index) => (
                  <View key={reward.reward_id} style={[styles.coral, styles.coralMedium]}>
                    <Text style={styles.coralEmoji}>🪸</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Small Corals */}
          {rewardsByLevel.small.length > 0 && (
            <View style={styles.rewardGroup}>
              <Text style={styles.rewardGroupTitle}>
                🌱 Small Corals ({rewardsByLevel.small.length})
              </Text>
              <View style={styles.coralGrid}>
                {rewardsByLevel.small.map((reward, index) => (
                  <View key={reward.reward_id} style={[styles.coral, styles.coralSmall]}>
                    <Text style={styles.coralEmoji}>🌱</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {rewards.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>🐚</Text>
              <Text style={styles.emptyTitle}>Your Ocean is Empty</Text>
              <Text style={styles.emptyText}>
                Complete focus sessions to earn corals and build your ocean ecosystem!
              </Text>
            </View>
          )}
        </View>

        {/* Ocean Floor Decoration */}
        <View style={styles.oceanFloor}>
          <Text style={styles.floorText}>🪨 🐚 🦀 🐠 🌊</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077BE',
  },
  oceanBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waves: {
    fontSize: 100,
    opacity: 0.1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  statsCard: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  rewardsSection: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    marginHorizontal: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 400,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0077BE',
    marginBottom: 20,
  },
  rewardGroup: {
    marginBottom: 24,
  },
  rewardGroupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  coralGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  coral: {
    width: (width - 80) / 4,
    height: (width - 80) / 4,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coralFull: {
    backgroundColor: '#FFE5E5',
  },
  coralMedium: {
    backgroundColor: '#FFF3E0',
  },
  coralSmall: {
    backgroundColor: '#E8F5E9',
  },
  coralEmoji: {
    fontSize: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  oceanFloor: {
    padding: 20,
    alignItems: 'center',
  },
  floorText: {
    fontSize: 24,
    letterSpacing: 8,
  },
});