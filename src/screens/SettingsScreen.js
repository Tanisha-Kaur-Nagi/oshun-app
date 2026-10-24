import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useApp } from '../context/AppContext';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, stats, settings, updateSettings, handleLogout } = useApp();

  const handleExportData = async () => {
    try {
      const data = {
        user,
        stats,
        exportedAt: new Date().toISOString(),
      };

      const jsonData = JSON.stringify(data, null, 2);
      const fileName = `oshion_data_${Date.now()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonData);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
        Alert.alert('Success', 'Data exported successfully!');
      } else {
        Alert.alert('Success', `Data saved to: ${fileUri}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: handleLogout },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'About OSHION',
      'OSHION - Digital Focus Regulator\n\nVersion 1.0.0\n\nBuild healthy focus habits and grow your ocean ecosystem!\n\nDeveloped with ❤️',
      [{ text: 'OK' }]
    );
  };

  return (
    <LinearGradient
      colors={['#0A0E27', '#1A1F3A', '#2D1B69']}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>⚙️ Settings</Text>
          <Text style={styles.subtitle}>Customize your experience</Text>
        </Animatable.View>

        {/* Profile Card */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.profileSection}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileCard}
          >
            <View style={styles.profileAvatar}>
              <Text style={styles.profileEmoji}>🌊</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.username}</Text>
              <Text style={styles.profileId}>ID: {user.userId}</Text>
            </View>
            <View style={styles.profileStats}>
              <Text style={styles.profileStatValue}>{stats.sessionCount}</Text>
              <Text style={styles.profileStatLabel}>Sessions</Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Stats Summary */}
        <Animatable.View animation="fadeInUp" delay={300}>
          <Text style={styles.sectionTitle}>Your Journey</Text>
          <LinearGradient
            colors={['rgba(102,126,234,0.2)', 'rgba(118,75,162,0.2)']}
            style={styles.statsCard}
          >
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Focus Time</Text>
              <Text style={styles.statValue}>{stats.totalMinutes} min</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Average Completion</Text>
              <Text style={styles.statValue}>{stats.avgCompletion}%</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Sessions</Text>
              <Text style={styles.statValue}>{stats.sessionCount}</Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* App Settings */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          {/* Notifications Toggle */}
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.settingItem}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <LinearGradient
                  colors={['#667EEA', '#764BA2']}
                  style={styles.settingIconGradient}
                >
                  <Text style={styles.settingIcon}>🔔</Text>
                </LinearGradient>
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Notifications</Text>
                <Text style={styles.settingDescription}>Get focus reminders</Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={(value) => updateSettings({ notificationsEnabled: value })}
              trackColor={{ false: '#3E3E3E', true: '#667EEA' }}
              thumbColor={settings.notificationsEnabled ? '#F093FB' : '#f4f3f4'}
            />
          </LinearGradient>

          {/* Sounds Toggle */}
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.settingItem}
          >
            <View style={styles.settingLeft}>
              <View style={styles.settingIconContainer}>
                <LinearGradient
                  colors={['#F093FB', '#F5576C']}
                  style={styles.settingIconGradient}
                >
                  <Text style={styles.settingIcon}>🔊</Text>
                </LinearGradient>
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Sounds</Text>
                <Text style={styles.settingDescription}>Session sound effects</Text>
              </View>
            </View>
            <Switch
              value={settings.soundsEnabled}
              onValueChange={(value) => updateSettings({ soundsEnabled: value })}
              trackColor={{ false: '#3E3E3E', true: '#F093FB' }}
              thumbColor={settings.soundsEnabled ? '#F5576C' : '#f4f3f4'}
            />
          </LinearGradient>

          {/* Theme */}
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                'Choose Theme',
                '',
                [
                  { text: 'Light', onPress: () => updateSettings({ theme: 'light' }) },
                  { text: 'Dark', onPress: () => updateSettings({ theme: 'dark' }) },
                  { text: 'Cancel', style: 'cancel' },
                ]
              );
            }}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <LinearGradient
                    colors={['#4FACFE', '#00F2FE']}
                    style={styles.settingIconGradient}
                  >
                    <Text style={styles.settingIcon}>🎨</Text>
                  </LinearGradient>
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Theme</Text>
                  <Text style={styles.settingDescription}>
                    Current: {settings.theme === 'dark' ? 'Dark' : 'Light'}
                  </Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Blocked Apps */}
          <TouchableOpacity onPress={() => router.push('/app-selection')}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <LinearGradient
                    colors={['#43E97B', '#38F9D7']}
                    style={styles.settingIconGradient}
                  >
                    <Text style={styles.settingIcon}>🚫</Text>
                  </LinearGradient>
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Blocked Apps</Text>
                  <Text style={styles.settingDescription}>Manage blocked apps</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Data Management */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <Text style={styles.sectionTitle}>Data</Text>

          {/* Export Data */}
          <TouchableOpacity onPress={handleExportData}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <LinearGradient
                    colors={['#667EEA', '#764BA2']}
                    style={styles.settingIconGradient}
                  >
                    <Text style={styles.settingIcon}>📤</Text>
                  </LinearGradient>
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Export Data</Text>
                  <Text style={styles.settingDescription}>Download your data</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* About */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity onPress={handleAbout}>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.settingItem}
            >
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <LinearGradient
                    colors={['#F093FB', '#F5576C']}
                    style={styles.settingIconGradient}
                  >
                    <Text style={styles.settingIcon}>ℹ️</Text>
                  </LinearGradient>
                </View>
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>About OSHION</Text>
                  <Text style={styles.settingDescription}>Version 1.0.0</Text>
                </View>
              </View>
              <Text style={styles.settingArrow}>›</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Logout Button */}
        <Animatable.View animation="fadeInUp" delay={700}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogoutPress}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#F5576C', '#F093FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.logoutGradient}
            >
              <Text style={styles.logoutIcon}>🚪</Text>
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Footer */}
        <Animatable.View animation="fadeIn" delay={800} style={styles.footer}>
          <Text style={styles.footerText}>OSHION v1.0.0</Text>
          <Text style={styles.footerSubtext}>Made with 💙 for better focus</Text>
        </Animatable.View>

        <View style={{ height: 50 }} />
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  profileSection: {
    marginBottom: 30,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileEmoji: {
    fontSize: 32,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
  },
  profileStats: {
    alignItems: 'center',
  },
  profileStatValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  profileStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    marginTop: 10,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  statDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIconContainer: {
    marginRight: 15,
  },
  settingIconGradient: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingIcon: {
    fontSize: 22,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  settingArrow: {
    fontSize: 24,
    color: 'rgba(255,255,255,0.4)',
  },
  logoutButton: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#F5576C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  logoutIcon: {
    fontSize: 24,
  },
  logoutText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    marginTop: 30,
  },
  footerText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
  },
});
