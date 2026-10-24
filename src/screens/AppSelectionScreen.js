import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const COMMON_APPS = [
  { name: 'Instagram', package: 'com.instagram.android', icon: '📷' },
  { name: 'Facebook', package: 'com.facebook.katana', icon: '📘' },
  { name: 'Twitter', package: 'com.twitter.android', icon: '🐦' },
  { name: 'TikTok', package: 'com.zhiliaoapp.musically', icon: '🎵' },
  { name: 'YouTube', package: 'com.google.android.youtube', icon: '📺' },
  { name: 'WhatsApp', package: 'com.whatsapp', icon: '💬' },
  { name: 'Snapchat', package: 'com.snapchat.android', icon: '👻' },
  { name: 'Telegram', package: 'org.telegram.messenger', icon: '✈️' },
  { name: 'Reddit', package: 'com.reddit.frontpage', icon: '🤖' },
  { name: 'Discord', package: 'com.discord', icon: '🎮' },
];

export default function AppSelectionScreen() {
  const router = useRouter();
  const [blockedApps, setBlockedApps] = useState([]);
  const [customAppName, setCustomAppName] = useState('');
  const [customPackage, setCustomPackage] = useState('');

  useEffect(() => {
    loadBlockedApps();
  }, []);

  const loadBlockedApps = async () => {
    try {
      const saved = await AsyncStorage.getItem('@blocked_apps');
      if (saved) {
        setBlockedApps(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading blocked apps:', error);
    }
  };

  const toggleApp = async (app) => {
    try {
      let updated;
      const isBlocked = blockedApps.some((a) => a.package === app.package);
      if (isBlocked) {
        updated = blockedApps.filter((a) => a.package !== app.package);
      } else {
        updated = [...blockedApps, app];
      }
      setBlockedApps(updated);
      await AsyncStorage.setItem('@blocked_apps', JSON.stringify(updated));
    } catch (error) {
      console.error('Error toggling app:', error);
    }
  };

  const addCustomApp = async () => {
    if (!customAppName.trim() || !customPackage.trim()) {
      Alert.alert('Error', 'Please enter both app name and package name');
      return;
    }
    const newApp = {
      name: customAppName.trim(),
      package: customPackage.trim(),
      icon: '📱',
    };
    try {
      const updated = [...blockedApps, newApp];
      setBlockedApps(updated);
      await AsyncStorage.setItem('@blocked_apps', JSON.stringify(updated));
      setCustomAppName('');
      setCustomPackage('');
      Alert.alert('Success', `${newApp.name} added to blocked apps`);
    } catch (error) {
      console.error('Error adding custom app:', error);
    }
  };

  const isAppBlocked = (packageName) => {
    return blockedApps.some((a) => a.package === packageName);
  };

  return (
    <LinearGradient colors={['#0A0E27', '#1A1F3A', '#2D1B69']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🚫 Block Apps</Text>
          <Text style={styles.subtitle}>Select apps to monitor during focus sessions</Text>
        </Animatable.View>

        {/* Stats Row */}
        <Animatable.View animation="fadeInUp" delay={100} style={styles.statsRow}>
          <LinearGradient colors={['rgba(245,87,108,0.25)', 'rgba(240,147,251,0.15)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{blockedApps.length}</Text>
            <Text style={styles.statLabel}>Blocked</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(102,126,234,0.25)', 'rgba(118,75,162,0.15)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{COMMON_APPS.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </LinearGradient>
          <LinearGradient colors={['rgba(79,209,197,0.25)', 'rgba(72,177,166,0.15)']} style={styles.statCard}>
            <Text style={styles.statNumber}>{COMMON_APPS.length - blockedApps.filter(a => COMMON_APPS.some(c => c.package === a.package)).length}</Text>
            <Text style={styles.statLabel}>Allowed</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Info Card */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <LinearGradient
            colors={['rgba(102,126,234,0.15)', 'rgba(118,75,162,0.1)']}
            style={styles.infoCard}
          >
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Opening a blocked app during a focus session counts as an interruption and reduces your completion score by 5%.
            </Text>
          </LinearGradient>
        </Animatable.View>

        {/* Popular Apps - HORIZONTAL LIST */}
        <Animatable.View animation="fadeInUp" delay={300}>
          <Text style={styles.sectionTitle}>Popular Apps</Text>
          <View style={styles.appsList}>
            {COMMON_APPS.map((app, index) => {
              const blocked = isAppBlocked(app.package);
              return (
                <Animatable.View
                  key={app.package}
                  animation="fadeInUp"
                  delay={40 * index}
                >
                  <TouchableOpacity
                    onPress={() => toggleApp(app)}
                    activeOpacity={0.75}
                  >
                    <LinearGradient
                      colors={
                        blocked
                          ? ['rgba(245,87,108,0.3)', 'rgba(240,147,251,0.2)']
                          : ['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']
                      }
                      style={[styles.appRow, blocked && styles.appRowBlocked]}
                    >
                      {/* Left: Icon + Name + Package */}
                      <View style={styles.appRowLeft}>
                        <View style={[styles.appIconWrapper, blocked && styles.appIconWrapperBlocked]}>
                          <Text style={styles.appIcon}>{app.icon}</Text>
                        </View>
                        <View style={styles.appInfo}>
                          <Text style={styles.appName}>{app.name}</Text>
                          <Text style={styles.appPackage} numberOfLines={1}>{app.package}</Text>
                        </View>
                      </View>

                      {/* Right: Toggle */}
                      <View style={[styles.toggleBadge, blocked ? styles.toggleBadgeOn : styles.toggleBadgeOff]}>
                        <Text style={[styles.toggleText, blocked ? styles.toggleTextOn : styles.toggleTextOff]}>
                          {blocked ? '✓ Blocked' : 'Allow'}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animatable.View>
              );
            })}
          </View>
        </Animatable.View>

        {/* Add Custom App */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Text style={styles.sectionTitle}>Add Custom App</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0.02)']}
            style={styles.customCard}
          >
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>App Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Candy Crush"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={customAppName}
                onChangeText={setCustomAppName}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Package Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., com.king.candycrushsaga"
                placeholderTextColor="rgba(255,255,255,0.3)"
                value={customPackage}
                onChangeText={setCustomPackage}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity style={styles.addButton} onPress={addCustomApp} activeOpacity={0.8}>
              <LinearGradient
                colors={['#667EEA', '#764BA2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.addButtonGradient}
              >
                <Text style={styles.addButtonText}>+ Add App</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animatable.View>

        {/* Currently Blocked List */}
        {blockedApps.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={600}>
            <Text style={styles.sectionTitle}>Currently Blocked</Text>
            {blockedApps.map((app, index) => (
              <Animatable.View
                key={app.package}
                animation="fadeInRight"
                delay={50 * index}
                style={styles.blockedItem}
              >
                <LinearGradient
                  colors={['rgba(245,87,108,0.18)', 'rgba(240,147,251,0.12)']}
                  style={styles.blockedItemGradient}
                >
                  <View style={styles.appRowLeft}>
                    <View style={styles.appIconWrapperBlocked}>
                      <Text style={styles.appIcon}>{app.icon}</Text>
                    </View>
                    <View style={styles.appInfo}>
                      <Text style={styles.appName}>{app.name}</Text>
                      <Text style={styles.appPackage} numberOfLines={1}>{app.package}</Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => toggleApp(app)} style={styles.removeButton}>
                    <Text style={styles.removeButtonText}>Remove</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Animatable.View>
            ))}
          </Animatable.View>
        )}

        {/* Help Card */}
        <Animatable.View animation="fadeIn" delay={700} style={styles.helpCard}>
          <Text style={styles.helpTitle}>💬 How to find package names?</Text>
          <Text style={styles.helpText}>
            1. Open Play Store{'\n'}
            2. Search for the app{'\n'}
            3. Check the URL — it contains the package name{'\n'}
            4. Example: play.google.com/store/apps/details?id=
            <Text style={styles.helpHighlight}>com.example.app</Text>
          </Text>
        </Animatable.View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },

  // Header
  header: { marginBottom: 24 },
  backButton: { marginBottom: 16 },
  backText: { color: 'white', fontSize: 16, fontWeight: '600' },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 20 },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statNumber: { fontSize: 26, fontWeight: 'bold', color: 'white' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 },

  // Info Card
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.25)',
  },
  infoIcon: { fontSize: 22, marginRight: 12 },
  infoText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.75)', lineHeight: 19 },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    marginTop: 6,
  },

  // Apps Horizontal List
  appsList: { gap: 10, marginBottom: 28 },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  appRowBlocked: {
    borderColor: 'rgba(245,87,108,0.4)',
  },
  appRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  appIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appIconWrapperBlocked: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(245,87,108,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appIcon: { fontSize: 22 },
  appInfo: { flex: 1 },
  appName: { fontSize: 15, fontWeight: '600', color: 'white', marginBottom: 2 },
  appPackage: { fontSize: 11, color: 'rgba(255,255,255,0.4)' },

  // Toggle Badge
  toggleBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  toggleBadgeOn: {
    backgroundColor: 'rgba(245,87,108,0.2)',
    borderColor: 'rgba(245,87,108,0.5)',
  },
  toggleBadgeOff: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.15)',
  },
  toggleText: { fontSize: 12, fontWeight: '700' },
  toggleTextOn: { color: '#F5576C' },
  toggleTextOff: { color: 'rgba(255,255,255,0.45)' },

  // Custom App Card
  customCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  inputContainer: { marginBottom: 14 },
  inputLabel: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 7, fontWeight: '600' },
  input: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 11,
    padding: 13,
    color: 'white',
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  addButton: { borderRadius: 11, overflow: 'hidden', marginTop: 6 },
  addButtonGradient: { paddingVertical: 14, alignItems: 'center' },
  addButtonText: { color: 'white', fontSize: 15, fontWeight: 'bold' },

  // Blocked List
  blockedItem: { marginBottom: 10 },
  blockedItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(245,87,108,0.25)',
  },
  removeButton: {
    backgroundColor: 'rgba(245,87,108,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245,87,108,0.3)',
  },
  removeButtonText: { color: '#F5576C', fontSize: 12, fontWeight: '700' },

  // Help Card
  helpCard: {
    backgroundColor: 'rgba(102,126,234,0.08)',
    borderRadius: 14,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.25)',
  },
  helpTitle: { fontSize: 14, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  helpText: { fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 21 },
  helpHighlight: { color: '#667EEA', fontWeight: 'bold' },
});