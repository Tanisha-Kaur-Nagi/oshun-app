import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useApp } from '../context/AppContext';
import { ACHIEVEMENTS } from '../utils/achievements';

const { width } = Dimensions.get('window');

export default function AchievementsScreen() {
  const { achievements, sessions, stats, streak, rewards } = useApp();

  const unlockedIds = achievements.map((a) => a.achievement_id);

  const getProgress = (achievement) => {
    switch (achievement.id) {
      case 'first_session':
        return Math.min((sessions.length / 1) * 100, 100);
      case 'five_sessions':
        return Math.min((sessions.length / 5) * 100, 100);
      case 'ten_sessions':
        return Math.min((sessions.length / 10) * 100, 100);
      case 'perfect_session':
        const perfectCount = sessions.filter((s) => s.completion_percentage === 100).length;
        return Math.min((perfectCount / 1) * 100, 100);
      case 'thirty_min_no_interruption':
        const noInterrupt30 = sessions.filter(
          (s) => s.actual_duration >= 30 && !s.is_interrupted
        ).length;
        return Math.min((noInterrupt30 / 1) * 100, 100);
      case 'hour_focus':
        const hourSessions = sessions.filter((s) => s.actual_duration >= 60).length;
        return Math.min((hourSessions / 1) * 100, 100);
      case 'five_day_streak':
        return Math.min((streak / 5) * 100, 100);
      case 'ten_day_streak':
        return Math.min((streak / 10) * 100, 100);
      case 'hundred_minutes':
        return Math.min((stats.totalMinutes / 100) * 100, 100);
      case 'five_hundred_minutes':
        return Math.min((stats.totalMinutes / 500) * 100, 100);
      case 'high_completion':
        if (sessions.length >= 10) {
          return stats.avgCompletion >= 90 ? 100 : (stats.avgCompletion / 90) * 100;
        }
        return (sessions.length / 10) * 100;
      case 'ten_corals':
        return Math.min((rewards.length / 10) * 100, 100);
      default:
        return 0;
    }
  };

  const totalAchievements = ACHIEVEMENTS.length;
  const unlockedCount = unlockedIds.length;
  const overallProgress = Math.round((unlockedCount / totalAchievements) * 100);

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
          <Text style={styles.title}>🏆 Achievements</Text>
          <Text style={styles.subtitle}>Unlock badges through focus</Text>
        </Animatable.View>

        {/* Progress Card */}
        <Animatable.View animation="fadeInUp" delay={200} style={styles.progressCard}>
          <LinearGradient
            colors={['#667EEA', '#764BA2', '#F093FB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressGradient}
          >
            <Text style={styles.progressTitle}>Overall Progress</Text>
            <Text style={styles.progressValue}>
              {unlockedCount} / {totalAchievements}
            </Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${overallProgress}%` }]} />
            </View>
            <Text style={styles.progressPercentage}>{overallProgress}% Complete</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Achievements Grid */}
        <Animatable.View animation="fadeInUp" delay={300}>
          <Text style={styles.sectionTitle}>All Achievements</Text>
          <View style={styles.achievementsGrid}>
            {ACHIEVEMENTS.map((achievement, index) => {
              const isUnlocked = unlockedIds.includes(achievement.id);
              const progress = getProgress(achievement);

              return (
                <Animatable.View
                  key={achievement.id}
                  animation={isUnlocked ? 'bounceIn' : 'fadeIn'}
                  delay={index * 50}
                  style={styles.achievementItem}
                >
                  <LinearGradient
                    colors={
                      isUnlocked
                        ? ['rgba(102,126,234,0.3)', 'rgba(118,75,162,0.3)']
                        : ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']
                    }
                    style={[styles.achievementCard, !isUnlocked && styles.lockedCard]}
                  >
                    {/* Badge Icon */}
                    <View style={styles.badgeContainer}>
                      {isUnlocked ? (
                        <LinearGradient
                          colors={['#FFD700', '#FFA500']}
                          style={styles.badgeGradient}
                        >
                          <Text style={styles.badgeIcon}>{achievement.icon}</Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.lockedBadge}>
                          <Text style={styles.lockIcon}>🔒</Text>
                        </View>
                      )}
                    </View>

                    {/* Achievement Name */}
                    <Text
                      style={[styles.achievementName, !isUnlocked && styles.lockedText]}
                      numberOfLines={2}
                    >
                      {achievement.name}
                    </Text>

                    {/* Description */}
                    <Text
                      style={[styles.achievementDescription, !isUnlocked && styles.lockedDescription]}
                      numberOfLines={2}
                    >
                      {achievement.description}
                    </Text>

                    {/* Progress Bar */}
                    {!isUnlocked && (
                      <View style={styles.achievementProgressContainer}>
                        <View style={styles.achievementProgressBar}>
                          <LinearGradient
                            colors={['#667EEA', '#764BA2']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.achievementProgressFill, { width: `${progress}%` }]}
                          />
                        </View>
                        <Text style={styles.achievementProgressText}>{Math.round(progress)}%</Text>
                      </View>
                    )}

                    {/* Unlocked Badge */}
                    {isUnlocked && (
                      <View style={styles.unlockedBadge}>
                        <Text style={styles.unlockedText}>✓ Unlocked</Text>
                      </View>
                    )}
                  </LinearGradient>
                </Animatable.View>
              );
            })}
          </View>
        </Animatable.View>

        {/* Empty State */}
        {unlockedCount === 0 && (
          <Animatable.View animation="fadeIn" style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyTitle}>Start Your Journey</Text>
            <Text style={styles.emptyText}>
              Complete focus sessions to unlock achievements and track your progress!
            </Text>
          </Animatable.View>
        )}

        {/* Motivation Message */}
        {unlockedCount > 0 && unlockedCount < totalAchievements && (
          <Animatable.View animation="fadeIn" delay={600} style={styles.motivationCard}>
            <LinearGradient
              colors={['rgba(240,147,251,0.2)', 'rgba(245,87,108,0.2)']}
              style={styles.motivationGradient}
            >
              <Text style={styles.motivationIcon}>🎯</Text>
              <Text style={styles.motivationText}>
                {unlockedCount < 3
                  ? 'Great start! Keep focusing to unlock more achievements!'
                  : unlockedCount < 6
                  ? 'You\'re on fire! More achievements await!'
                  : unlockedCount < 9
                  ? 'Incredible progress! Almost there!'
                  : 'You\'re a focus master! Just a few more to go!'}
              </Text>
            </LinearGradient>
          </Animatable.View>
        )}

        {/* Completion Message */}
        {unlockedCount === totalAchievements && (
          <Animatable.View animation="bounceIn" style={styles.completionCard}>
            <LinearGradient
              colors={['#43E97B', '#38F9D7']}
              style={styles.completionGradient}
            >
              <Text style={styles.completionIcon}>👑</Text>
              <Text style={styles.completionTitle}>Achievement Master!</Text>
              <Text style={styles.completionText}>
                You've unlocked all achievements! You're a true focus champion!
              </Text>
            </LinearGradient>
          </Animatable.View>
        )}

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
  progressCard: {
    marginBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  progressGradient: {
    padding: 25,
    alignItems: 'center',
  },
  progressTitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
  },
  progressValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementItem: {
    width: (width - 52) / 2,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 200,
  },
  lockedCard: {
    opacity: 0.6,
  },
  badgeContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 5,
  },
  badgeIcon: {
    fontSize: 32,
  },
  lockedBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 28,
  },
  achievementName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 6,
  },
  lockedText: {
    color: 'rgba(255,255,255,0.5)',
  },
  achievementDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 10,
  },
  lockedDescription: {
    color: 'rgba(255,255,255,0.4)',
  },
  achievementProgressContainer: {
    marginTop: 8,
  },
  achievementProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 6,
  },
  achievementProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  achievementProgressText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  unlockedBadge: {
    backgroundColor: 'rgba(67,233,123,0.3)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    alignSelf: 'center',
    marginTop: 8,
  },
  unlockedText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#43E97B',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  motivationCard: {
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
  },
  motivationGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  motivationIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  motivationText: {
    flex: 1,
    fontSize: 14,
    color: 'white',
    lineHeight: 20,
    fontWeight: '500',
  },
  completionCard: {
    marginTop: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  completionGradient: {
    padding: 30,
    alignItems: 'center',
  },
  completionIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  completionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  completionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 20,
  },
});