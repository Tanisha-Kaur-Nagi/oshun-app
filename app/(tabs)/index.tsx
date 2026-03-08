import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { useApp } from '../../src/context/AppContext';

export default function HomeScreen() {
  const { user, stats, todayStats, rewards, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
        <Text style={styles.loadingText}>Loading database...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌊</Text>
      <Text style={styles.title}>OSHION</Text>
      <Text style={styles.subtitle}>Database Connected!</Text>
      
      {/* Today's Stats */}
      <View style={styles.todayBox}>
        <Text style={styles.boxTitle}>📅 Today</Text>
        <Text style={styles.statsText}>Sessions: {todayStats.sessionCount}</Text>
        <Text style={styles.statsText}>Focus Time: {todayStats.totalMinutes} min</Text>
      </View>

      {/* All-Time Stats */}
      <View style={styles.statsBox}>
        <Text style={styles.boxTitle}>📊 All Time</Text>
        <Text style={styles.statsText}>Total Sessions: {stats.sessionCount}</Text>
        <Text style={styles.statsText}>Total Time: {stats.totalMinutes} min</Text>
        <Text style={styles.statsText}>Avg Completion: {stats.avgCompletion}%</Text>
        <Text style={styles.statsText}>Rewards Earned: {rewards.length}</Text>
      </View>
      
      <Text style={styles.success}>✅ Database Working!</Text>
      
      <Text style={styles.hint}>
        User: {user.username} (ID: {user.userId})
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0077BE',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
    marginBottom: 25,
  },
  loadingText: {
    color: 'white',
    marginTop: 15,
    fontSize: 16,
  },
  todayBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    width: '100%',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  statsBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  boxTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  statsText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 6,
  },
  success: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
});
