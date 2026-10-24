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
import { format, subDays } from 'date-fns';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const { sessions, stats, streak } = useApp();

  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i));

  const weeklyData = last7Days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = sessions.filter(
      (s) => s.start_time && s.start_time.startsWith(dateStr)
    );
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.actual_duration, 0);
    return {
      value: totalMinutes,
      label: format(date, 'EEE'),
    };
  });

  const maxValue = Math.max(...weeklyData.map((d) => d.value), 60);

  const avgSessionLength = sessions.length > 0
    ? Math.round(sessions.reduce((sum, s) => sum + s.actual_duration, 0) / sessions.length)
    : 0;

  const interruptionRate = sessions.length > 0
    ? Math.round((sessions.filter((s) => s.is_interrupted).length / sessions.length) * 100)
    : 0;

  const excellent = sessions.filter((s) => s.completion_percentage >= 90).length;
  const good = sessions.filter((s) => s.completion_percentage >= 70 && s.completion_percentage < 90).length;
  const fair = sessions.filter((s) => s.completion_percentage >= 50 && s.completion_percentage < 70).length;
  const poor = sessions.filter((s) => s.completion_percentage < 50).length;

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
          <Text style={styles.title}>📊 Analytics</Text>
          <Text style={styles.subtitle}>Deep dive into your focus patterns</Text>
        </Animatable.View>

        {/* Key Metrics */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <View style={styles.metricsGrid}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.metricCard}
            >
              <Text style={styles.metricIcon}>⚡</Text>
              <Text style={styles.metricValue}>{streak}</Text>
              <Text style={styles.metricLabel}>Day Streak</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#F093FB', '#F5576C']}
              style={styles.metricCard}
            >
              <Text style={styles.metricIcon}>⏱️</Text>
              <Text style={styles.metricValue}>{avgSessionLength}m</Text>
              <Text style={styles.metricLabel}>Avg Session</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#43E97B', '#38F9D7']}
              style={styles.metricCard}
            >
              <Text style={styles.metricIcon}>🎯</Text>
              <Text style={styles.metricValue}>{stats.avgCompletion}%</Text>
              <Text style={styles.metricLabel}>Avg Focus</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4FACFE', '#00F2FE']}
              style={styles.metricCard}
            >
              <Text style={styles.metricIcon}>⚠️</Text>
              <Text style={styles.metricValue}>{interruptionRate}%</Text>
              <Text style={styles.metricLabel}>Interrupted</Text>
            </LinearGradient>
          </View>
        </Animatable.View>

        {/* Weekly Chart - Custom */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
          <Text style={styles.sectionTitle}>📈 Last 7 Days</Text>
          <LinearGradient
            colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
            style={styles.chartCard}
          >
            <View style={styles.barChart}>
              {weeklyData.map((day, index) => {
                const barHeight = maxValue > 0 ? (day.value / maxValue) * 150 : 4;
                return (
                  <View key={index} style={styles.barColumn}>
                    <Text style={styles.barValue}>
                      {day.value > 0 ? day.value : ''}
                    </Text>
                    <View style={styles.barWrapper}>
                      <LinearGradient
                        colors={day.value > 0 ? ['#667EEA', '#764BA2'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                        style={[styles.bar, { height: Math.max(barHeight, 4) }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{day.label}</Text>
                  </View>
                );
              })}
            </View>
            <Text style={styles.chartCaption}>Focus minutes per day</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Focus Quality */}
        {sessions.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
            <Text style={styles.sectionTitle}>🎯 Focus Quality</Text>
            <LinearGradient
              colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
              style={styles.chartCard}
            >
              {[
                { label: 'Excellent (90%+)', count: excellent, color: '#43E97B' },
                { label: 'Good (70-89%)', count: good, color: '#667EEA' },
                { label: 'Fair (50-69%)', count: fair, color: '#F093FB' },
                { label: 'Poor (<50%)', count: poor, color: '#F5576C' },
              ].map((item, index) => {
                const barWidth = sessions.length > 0
                  ? (item.count / sessions.length) * (width - 100)
                  : 0;
                return (
                  <View key={index} style={styles.qualityRow}>
                    <Text style={styles.qualityLabel}>{item.label}</Text>
                    <View style={styles.qualityBarBg}>
                      <View
                        style={[
                          styles.qualityBar,
                          { width: Math.max(barWidth, item.count > 0 ? 20 : 0), backgroundColor: item.color },
                        ]}
                      />
                    </View>
                    <Text style={styles.qualityCount}>{item.count}</Text>
                  </View>
                );
              })}
            </LinearGradient>
          </Animatable.View>
        )}

        {/* Insights */}
        {sessions.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={500} style={styles.section}>
            <Text style={styles.sectionTitle}>💡 Insights</Text>

            {streak >= 3 && (
              <LinearGradient
                colors={['rgba(102,126,234,0.2)', 'rgba(118,75,162,0.2)']}
                style={styles.insightCard}
              >
                <Text style={styles.insightIcon}>🔥</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Great Streak!</Text>
                  <Text style={styles.insightText}>
                    You've focused for {streak} days in a row. Keep it up!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {stats.avgCompletion >= 80 && sessions.length >= 3 && (
              <LinearGradient
                colors={['rgba(67,233,123,0.2)', 'rgba(56,249,215,0.2)']}
                style={styles.insightCard}
              >
                <Text style={styles.insightIcon}>🎯</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>High Quality Focus</Text>
                  <Text style={styles.insightText}>
                    Your average completion is {stats.avgCompletion}%. Excellent!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {interruptionRate > 30 && sessions.length >= 3 && (
              <LinearGradient
                colors={['rgba(245,87,108,0.2)', 'rgba(240,147,251,0.2)']}
                style={styles.insightCard}
              >
                <Text style={styles.insightIcon}>⚠️</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Interruption Alert</Text>
                  <Text style={styles.insightText}>
                    {interruptionRate}% of sessions interrupted. Try blocking more apps!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {avgSessionLength < 30 && sessions.length >= 3 && (
              <LinearGradient
                colors={['rgba(74,172,254,0.2)', 'rgba(0,242,254,0.2)']}
                style={styles.insightCard}
              >
                <Text style={styles.insightIcon}>💪</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Room for Growth</Text>
                  <Text style={styles.insightText}>
                    Try increasing session length. Longer sessions build deeper focus!
                  </Text>
                </View>
              </LinearGradient>
            )}

            {sessions.length < 3 && (
              <LinearGradient
                colors={['rgba(102,126,234,0.2)', 'rgba(118,75,162,0.2)']}
                style={styles.insightCard}
              >
                <Text style={styles.insightIcon}>🌱</Text>
                <View style={styles.insightContent}>
                  <Text style={styles.insightTitle}>Just Getting Started</Text>
                  <Text style={styles.insightText}>
                    Complete more sessions to unlock detailed insights!
                  </Text>
                </View>
              </LinearGradient>
            )}
          </Animatable.View>
        )}

        {/* Empty State */}
        {sessions.length === 0 && (
          <Animatable.View animation="fadeIn" style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>No Analytics Yet</Text>
            <Text style={styles.emptyText}>
              Complete focus sessions to see detailed analytics!
            </Text>
          </Animatable.View>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 30 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  subtitle: { fontSize: 14, color: 'rgba(255,255,255,0.6)', letterSpacing: 1 },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 25,
  },
  metricCard: {
    width: (width - 52) / 2,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
  },
  metricIcon: { fontSize: 32, marginBottom: 8 },
  metricValue: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  metricLabel: { fontSize: 12, color: 'rgba(255,255,255,0.9)', textAlign: 'center' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 15 },
  chartCard: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    marginBottom: 10,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 4,
  },
  barWrapper: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: 28,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 6,
  },
  chartCaption: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 8,
  },
  qualityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  qualityLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    width: 110,
  },
  qualityBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 4,
    marginHorizontal: 8,
  },
  qualityBar: {
    height: 8,
    borderRadius: 4,
  },
  qualityCount: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    width: 20,
    textAlign: 'right',
  },
  insightCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  insightIcon: { fontSize: 32, marginRight: 15 },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  insightText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
  emptyState: { alignItems: 'center', paddingVertical: 80 },
  emptyIcon: { fontSize: 80, marginBottom: 20 },
  emptyTitle: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  emptyText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', textAlign: 'center', paddingHorizontal: 40 },
});
