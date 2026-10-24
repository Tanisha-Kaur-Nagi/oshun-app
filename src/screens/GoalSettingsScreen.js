import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useApp } from '../context/AppContext';
import { setDailyGoalTarget } from '../services/database';

const PRESET_GOALS = [15, 30, 45, 60, 90, 120];

export default function GoalSettingsScreen() {
  const router = useRouter();
  const { user, todayGoal, refreshData } = useApp();
  const [selectedMinutes, setSelectedMinutes] = useState(todayGoal?.target_minutes || 60);
  const [customValue, setCustomValue] = useState('');
  const [isCustom, setIsCustom] = useState(false);

  const handleSave = async () => {
    const minutes = isCustom ? parseInt(customValue) : selectedMinutes;

    if (!minutes || minutes < 5 || minutes > 300) {
      Alert.alert('Invalid Goal', 'Please enter a goal between 5-300 minutes');
      return;
    }

    try {
      await setDailyGoalTarget(user.userId, minutes);
      refreshData();
      Alert.alert('Success', `Daily goal set to ${minutes} minutes!`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save goal');
    }
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🎯 Daily Goal</Text>
          <Text style={styles.subtitle}>Set your daily focus target</Text>
        </Animatable.View>

        {/* Current Goal */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <LinearGradient
            colors={['#667EEA', '#764BA2']}
            style={styles.currentGoalCard}
          >
            <Text style={styles.currentGoalLabel}>Current Goal</Text>
            <Text style={styles.currentGoalValue}>
              {todayGoal?.target_minutes || 60} minutes
            </Text>
          </LinearGradient>
        </Animatable.View>

        {/* Preset Options */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Select</Text>
          <View style={styles.presetsGrid}>
            {PRESET_GOALS.map((minutes) => (
              <TouchableOpacity
                key={minutes}
                onPress={() => {
                  setIsCustom(false);
                  setSelectedMinutes(minutes);
                }}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    !isCustom && selectedMinutes === minutes
                      ? ['#667EEA', '#764BA2']
                      : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                  }
                  style={[
                    styles.presetButton,
                    !isCustom && selectedMinutes === minutes && styles.presetButtonActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.presetText,
                      !isCustom && selectedMinutes === minutes && styles.presetTextActive,
                    ]}
                  >
                    {minutes}
                  </Text>
                  <Text
                    style={[
                      styles.presetLabel,
                      !isCustom && selectedMinutes === minutes && styles.presetLabelActive,
                    ]}
                  >
                    min
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animatable.View>

        {/* Custom Input */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
          <Text style={styles.sectionTitle}>Custom Goal</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.customInputContainer}
          >
            <TextInput
              style={styles.input}
              placeholder="Enter minutes (5-300)"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="number-pad"
              value={customValue}
              onChangeText={(text) => {
                setCustomValue(text);
                if (text) setIsCustom(true);
              }}
              maxLength={3}
            />
            <Text style={styles.inputSuffix}>minutes</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Recommendations */}
        <Animatable.View animation="fadeInUp" delay={500}>
          <LinearGradient
            colors={['rgba(102,126,234,0.2)', 'rgba(118,75,162,0.2)']}
            style={styles.recommendationsCard}
          >
            <Text style={styles.recommendationsTitle}>💡 Recommendations</Text>
            <Text style={styles.recommendationText}>
              • Beginners: Start with 30-45 minutes{'\n'}
              • Intermediate: Aim for 60-90 minutes{'\n'}
              • Advanced: Challenge yourself with 120+ minutes{'\n'}
              • Build gradually to avoid burnout
            </Text>
          </LinearGradient>
        </Animatable.View>

        {/* Save Button */}
        <Animatable.View animation="fadeInUp" delay={600}>
          <TouchableOpacity
            onPress={handleSave}
            activeOpacity={0.8}
            style={styles.saveButtonWrapper}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2', '#F093FB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Save Goal</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        <View style={{ height: 40 }} />
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
    marginBottom: 30,
  },
  backButton: {
    marginBottom: 15,
  },
  backText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 16,
    fontWeight: '600',
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
    letterSpacing: 0.5,
  },
  currentGoalCard: {
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  currentGoalLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    letterSpacing: 1,
  },
  currentGoalValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  presetButton: {
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    minWidth: 80,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  presetButtonActive: {
    borderColor: '#667EEA',
    borderWidth: 2,
  },
  presetText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255,255,255,0.7)',
  },
  presetTextActive: {
    color: 'white',
  },
  presetLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 4,
  },
  presetLabelActive: {
    color: 'rgba(255,255,255,0.9)',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
    color: 'white',
  },
  inputSuffix: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
  },
  recommendationsCard: {
    borderRadius: 16,
    padding: 18,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: 'rgba(102,126,234,0.3)',
  },
  recommendationsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  recommendationText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 22,
  },
  saveButtonWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  saveButton: {
    padding: 18,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});