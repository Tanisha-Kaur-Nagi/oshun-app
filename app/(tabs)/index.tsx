import { StyleSheet, Text, View } from 'react-native';
import { useApp } from '../../src/context/AppContext';

export default function HomeScreen() {
  const { user, stats } = useApp();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>🌊</Text>
      <Text style={styles.title}>OSHION</Text>
      <Text style={styles.subtitle}>App is Running!</Text>
      
      <View style={styles.statsBox}>
        <Text style={styles.statsText}>User: {user.username}</Text>
        <Text style={styles.statsText}>Sessions: {stats.sessionCount}</Text>
        <Text style={styles.statsText}>Total Time: {stats.totalMinutes} min</Text>
      </View>
      
      <Text style={styles.success}>✅ Success!</Text>
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
    fontSize: 72,
    marginBottom: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    marginBottom: 30,
  },
  statsBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 30,
  },
  statsText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  success: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
});
