import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  BackHandler,
  Dimensions,
  Animated,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimerService from '../services/timer';
import AppBlockerService from '../services/appBlocker';
import { insertFocusSession, insertReward } from '../services/database';
import { useApp } from '../context/AppContext';
import { calculateRewardLevel } from '../utils/focusModes';

const { width } = Dimensions.get('window');

export default function ActiveFocusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, refreshData, setIsSessionActive, settings } = useApp();

  const modeName = params.mode || 'Study';
  const duration = parseInt(params.duration) || 25;

  const [timerState, setTimerState] = useState(TimerService.getState());
  const [sessionStartTime] = useState(new Date().toISOString());

  // Animation values
  const pulseAnim = useState(new Animated.Value(1))[0];
  const glowAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Setup session
    const setupSession = async () => {
      try {
        const savedApps = await AsyncStorage.getItem('@blocked_apps');
        const blockedApps = savedApps ? JSON.parse(savedApps) : [];

        AppBlockerService.startMonitoring(blockedApps, () => {
          Alert.alert(
            '⚠️ Focus Session Active',
            'You left OSHION. This will reduce your completion percentage.',
            [{ text: 'OK' }]
          );
        });
      } catch (error) {
        console.error('Error setting up monitoring:', error);
      }
    };

    setupSession();
    setIsSessionActive(true);

    TimerService.start(
      duration,
      (remainingSeconds) => {
        setTimerState(TimerService.getState());
      },
      () => {
        handleSessionComplete(false);
      }
    );

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      Alert.alert('End Session?', 'Are you sure you want to end this focus session?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'End Session', onPress: () => handleSessionComplete(true) },
      ]);
      return true;
    });

    return () => {
      TimerService.stop();
      AppBlockerService.stopMonitoring();
      setIsSessionActive(false);
      backHandler.remove();
    };
  }, []);

  const handleSessionComplete = async (interrupted) => {
    TimerService.stop();
    const interruptionCount = AppBlockerService.stopMonitoring();
    setIsSessionActive(false);

    let actualDuration = TimerService.getActualDuration();
    let completionPercentage = TimerService.getCompletionPercentage();

    if (interruptionCount > 0) {
      const penalty = Math.min(interruptionCount * 5, 30);
      completionPercentage = Math.max(completionPercentage - penalty, 0);
    }

    const reward = calculateRewardLevel(completionPercentage);

    try {
      const sessionId = await insertFocusSession({
        userId: user.userId,
        focusMode: modeName,
        plannedDuration: duration,
        actualDuration: actualDuration,
        completionPercentage: completionPercentage,
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        isInterrupted: interrupted || interruptionCount > 0,
      });

      if (reward.level !== 'none') {
        await insertReward({
          userId: user.userId,
          sessionId: sessionId,
          rewardType: 'coral',
          rewardLevel: reward.level,
          earnedAt: new Date().toISOString(),
        });
      }

      refreshData();

      const interruptionMessage =
        interruptionCount > 0
          ? `\n\n⚠️ ${interruptionCount} interruption${
              interruptionCount > 1 ? 's' : ''
            } detected (-${Math.min(interruptionCount * 5, 30)}%)`
          : '';

      Alert.alert(
        interrupted ? 'Session Ended' : '🎉 Session Complete!',
        `You focused for ${actualDuration} minutes (${Math.round(
          completionPercentage
        )}%)${interruptionMessage}\n\nReward: ${reward.emoji} ${reward.name}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      console.error('Error saving session:', error);
      Alert.alert('Error', 'Failed to save session. Please try again.');
      router.replace('/(tabs)');
    }
  };

  const handlePause = () => {
    TimerService.pause();
    setTimerState(TimerService.getState());
  };

  const handleResume = () => {
    TimerService.resume();
    setTimerState(TimerService.getState());
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((timerState.totalSeconds - timerState.remainingSeconds) / timerState.totalSeconds) * 100;

  return (
    <LinearGradient
      colors={['#0A0E27', '#1A1F3A', '#2D1B69', '#1A1F3A', '#0A0E27']}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Animated background circles */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={4000}
        style={[styles.bgCircle, styles.bgCircle1]}
      />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={5000}
        delay={1000}
        style={[styles.bgCircle, styles.bgCircle2]}
      />

      <View style={styles.content}>
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.modeText}>{modeName}</Text>
          <Text style={styles.durationText}>{duration} min session</Text>
        </Animatable.View>

        {/* Timer Circle */}
        <Animatable.View animation="fadeIn" delay={300} style={styles.timerContainer}>
          {/* Outer glow ring */}
          <Animated.View style={[styles.glowRing, { opacity: glowAnim }]}>
            <LinearGradient
              colors={['#667EEA', '#764BA2', '#F093FB', '#667EEA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.glowGradient}
            />
          </Animated.View>

          {/* Progress ring */}
          <View style={styles.progressRing}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.progressGradient,
                {
                  transform: [
                    { rotate: `${(progress * 3.6) - 90}deg` },
                  ],
                },
              ]}
            />
          </View>

          {/* Timer display */}
          <Animated.View style={[styles.timerCircle, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.3)']}
              style={styles.timerCircleGradient}
            >
              <Text style={styles.timerText}>{formatTime(timerState.remainingSeconds)}</Text>
              <Text style={styles.timerSubtext}>
                {timerState.isPaused ? 'Paused' : 'Remaining'}
              </Text>
              <View style={styles.progressTextContainer}>
                <Text style={styles.progressText}>{Math.round(progress)}%</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        </Animatable.View>

        {/* Controls */}
        <Animatable.View animation="fadeInUp" delay={500} style={styles.controls}>
          {timerState.isPaused ? (
            <TouchableOpacity style={styles.mainButton} onPress={handleResume} activeOpacity={0.8}>
              <LinearGradient
                colors={['#43E97B', '#38F9D7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mainButtonGradient}
              >
                <Text style={styles.buttonIcon}>▶️</Text>
                <Text style={styles.buttonText}>Resume</Text>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.mainButton} onPress={handlePause} activeOpacity={0.8}>
              <LinearGradient
                colors={['#F093FB', '#F5576C']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.mainButtonGradient}
              >
                <Text style={styles.buttonIcon}>⏸️</Text>
                <Text style={styles.buttonText}>Pause</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleSessionComplete(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={styles.secondaryButtonGradient}
            >
              <Text style={styles.secondaryButtonText}>End Session</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animatable.View>

        {/* Stats */}
        <Animatable.View animation="fadeInUp" delay={700} style={styles.statsContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Started</Text>
              <Text style={styles.statValue}>
                {new Date(sessionStartTime).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{duration} min</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>{Math.round(progress)}%</Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Motivational Text */}
        <Animatable.View
          animation="fadeIn"
          delay={900}
          style={styles.motivationContainer}
        >
          <Text style={styles.motivationText}>
            {progress < 25
              ? '🌱 Just getting started...'
              : progress < 50
              ? '🌿 Building focus...'
              : progress < 75
              ? '🌳 Great momentum!'
              : progress < 100
              ? '🌟 Almost there!'
              : '🎉 Session complete!'}
          </Text>
        </Animatable.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  bgCircle1: {
    width: 400,
    height: 400,
    backgroundColor: '#667EEA',
    top: -100,
    right: -100,
  },
  bgCircle2: {
    width: 350,
    height: 350,
    backgroundColor: '#F093FB',
    bottom: -80,
    left: -80,
  },
  content: {
    flex: 1,
    paddingTop: 80,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  modeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  glowRing: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 160,
    overflow: 'hidden',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
  },
  progressRing: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 8,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  progressGradient: {
    position: 'absolute',
    width: '50%',
    height: '100%',
    right: 0,
  },
  timerCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    overflow: 'hidden',
  },
  timerCircleGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 130,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    fontVariant: ['tabular-nums'],
  },
  timerSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
    letterSpacing: 1,
  },
  progressTextContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(102,126,234,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  controls: {
    width: '100%',
    gap: 12,
    marginBottom: 30,
  },
  mainButton: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  mainButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  buttonIcon: {
    fontSize: 24,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  secondaryButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  statsCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: 15,
  },
  motivationContainer: {
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    letterSpacing: 0.5,
  },
});
