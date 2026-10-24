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
import { format } from 'date-fns';

const { width } = Dimensions.get('window');

// Each bar gets its own unique gradient like the card in the reference image
const BAR_GRADIENTS = [
  ['#667EEA', '#764BA2'],
  ['#F093FB', '#F5576C'],
  ['#4FACFE', '#00F2FE'],
  ['#43E97B', '#38F9D7'],
  ['#FA709A', '#FEE140'],
  ['#A18CD1', '#FBC2EB'],
  ['#FF9A9E', '#FECFEF'],
];

export default function StatisticsScreen() {
  const { stats, sessions, todayStats, streak, rewards } = useApp();

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map((date, index) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const daySessions = sessions.filter(
      (s) => s.start_time && s.start_time.startsWith(dateStr)
    );
    const totalMinutes = daySessions.reduce((sum, s) => sum + s.actual_duration, 0);
    return {
      value: totalMinutes,
      label: format(date, 'EEE'),
      gradient: BAR_GRADIENTS[index],
    };
  });

  const maxValue = Math.max(...chartData.map((d) => d.value), 60);

  const modeColors = ['#667EEA', '#43E97B', '#F093FB', '#4FACFE'];

  const focusModeMap = {};
  sessions.forEach((s) => {
    if (!focusModeMap[s.focus_mode]) focusModeMap[s.focus_mode] = 0;
    focusModeMap[s.focus_mode]++;
  });
  const focusModes = Object.entries(focusModeMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const bestSession = sessions.length > 0
    ? sessions.reduce((best, s) =>
        s.completion_percentage > best.completion_percentage ? s : best
      , sessions[0])
    : null;

  const recentSessions = [...sessions]
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
    .slice(0, 4);

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
          <Text style={styles.title}>📊 Statistics</Text>
          <Text style={styles.subtitle}>Your focus journey at a glance</Text>
        </Animatable.View>

        {/* 4 Stat Cards */}
        <Animatable.View animation="fadeInUp" delay={200}>
          <View style={styles.statsGrid}>
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>🔥</Text>
              <Text style={styles.statValue}>{streak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#4FACFE', '#00F2FE']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>⏱️</Text>
              <Text style={styles.statValue}>{stats.totalMinutes}</Text>
              <Text style={styles.statLabel}>Total Min</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#43E97B', '#38F9D7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>✅</Text>
              <Text style={styles.statValue}>{stats.avgCompletion}%</Text>
              <Text style={styles.statLabel}>Avg Rate</Text>
            </LinearGradient>

            <LinearGradient
              colors={['#F093FB', '#F5576C']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statCard}
            >
              <Text style={styles.statEmoji}>🌊</Text>
              <Text style={styles.statValue}>{rewards.length}</Text>
              <Text style={styles.statLabel}>Rewards</Text>
            </LinearGradient>
          </View>
        </Animatable.View>

        {/* Weekly Focus Time Chart - COLORFUL VERSION */}
        <Animatable.View animation="fadeInUp" delay={300} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📈 Weekly Focus Time</Text>
            <Text style={styles.sectionSubtitle}>Last 7 days (minutes)</Text>
          </View>
          <LinearGradient
            colors={['rgba(20,20,50,0.9)', 'rgba(10,14,39,0.95)']}
            style={styles.chartCard}
          >
            {/* Glow effect background */}
            <View style={styles.chartGlowBg}>
              <LinearGradient
                colors={['rgba(102,126,234,0.08)', 'transparent']}
                style={styles.chartGlow}
              />
            </View>

            <View style={styles.barChart}>
              {chartData.map((day, index) => {
                const barHeight = maxValue > 0
                  ? Math.max((day.value / maxValue) * 150, 6)
                  : 6;
                const isEmpty = day.value === 0;

                return (
                  <View key={index} style={styles.barColumn}>
                    {/* Value label above bar */}
                    <Text style={[
                      styles.barValue,
                      { color: isEmpty ? 'transparent' : 'white' }
                    ]}>
                      {day.value > 0 ? day.value : '0'}
                    </Text>

                    {/* Bar with glow */}
                    <View style={styles.barWrapper}>
                      {isEmpty ? (
                        <View style={[styles.emptyBar, { height: 6 }]} />
                      ) : (
                        <View>
                          {/* Glow shadow */}
                          <View style={[
                            styles.barGlow,
                            {
                              height: barHeight,
                              backgroundColor: day.gradient[0],
                              opacity: 0.25,
                            }
                          ]} />
                          {/* Actual gradient bar */}
                          <LinearGradient
                            colors={day.gradient}
                            start={{ x: 0, y: 1 }}
                            end={{ x: 0, y: 0 }}
                            style={[styles.bar, { height: barHeight }]}
                          />
                        </View>
                      )}
                    </View>

                    {/* Day label */}
                    <Text style={styles.barLabel}>{day.label}</Text>
                  </View>
                );
              })}
            </View>

            {/* Bottom legend */}
            <View style={styles.chartLegend}>
              <View style={styles.chartLegendLine} />
              <Text style={styles.chartCaption}>minutes of focus per day</Text>
              <View style={styles.chartLegendLine} />
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Completion Rate Distribution */}
        <Animatable.View animation="fadeInUp" delay={400} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🎯 Completion Rate</Text>
            <Text style={styles.sectionSubtitle}>Session quality breakdown</Text>
          </View>
          <LinearGradient
            colors={['rgba(102,126,234,0.15)', 'rgba(118,75,162,0.05)']}
            style={styles.chartCard}
          >
            {sessions.length === 0 ? (
              <Text style={styles.emptyChartText}>No sessions yet</Text>
            ) : (
              <View style={styles.donutRow}>
                <View style={styles.donutContainer}>
                  <View style={styles.donutOuter}>
                    <LinearGradient
                      colors={['#43E97B', '#667EEA', '#F093FB', '#F5576C']}
                      style={styles.donutGradient}
                    />
                    <View style={styles.donutInner}>
                      <Text style={styles.donutValue}>{sessions.length}</Text>
                      <Text style={styles.donutLabel}>Sessions</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.donutLegend}>
                  {[
                    { label: '90%+ Excellent', count: excellent, color: '#43E97B' },
                    { label: '70-89% Good', count: good, color: '#667EEA' },
                    { label: '50-69% Fair', count: fair, color: '#F093FB' },
                    { label: '<50% Poor', count: poor, color: '#F5576C' },
                  ].map((item, i) => (
                    <View key={i} style={styles.legendRow}>
                      <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                      <Text style={styles.legendText}>{item.label}</Text>
                      <Text style={[styles.legendCount, { color: item.color }]}>
                        {item.count}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </LinearGradient>
        </Animatable.View>

        {/* Focus Modes */}
        {focusModes.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={500} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📚 Focus Modes</Text>
              <Text style={styles.sectionSubtitle}>Your preferred modes</Text>
            </View>
            <LinearGradient
              colors={['rgba(102,126,234,0.15)', 'rgba(118,75,162,0.05)']}
              style={styles.chartCard}
            >
              {focusModes.map(([mode, count], index) => {
                const maxCount = focusModes[0][1];
                const barWidth = (count / maxCount) * (width - 140);
                return (
                  <View key={index} style={styles.modeRow}>
                    <View style={[styles.modeDot, { backgroundColor: modeColors[index] }]} />
                    <Text style={styles.modeLabel}>{mode}</Text>
                    <View style={styles.modeBarBg}>
                      <View
                        style={[
                          styles.modeBar,
                          { width: barWidth, backgroundColor: modeColors[index] },
                        ]}
                      />
                    </View>
                    <Text style={[styles.modeCount, { color: modeColors[index] }]}>
                      {count}
                    </Text>
                  </View>
                );
              })}
            </LinearGradient>
          </Animatable.View>
        )}

        {/* Best Session */}
        {bestSession && (
          <Animatable.View animation="fadeInUp" delay={600} style={styles.section}>
            <Text style={styles.sectionTitle}>🏆 Best Session</Text>
            <LinearGradient
              colors={['rgba(255,215,0,0.15)', 'rgba(255,140,0,0.08)']}
              style={[styles.chartCard, styles.bestSessionCard]}
            >
              <View>
                <Text style={styles.bestSessionMode}>{bestSession.focus_mode}</Text>
                <Text style={styles.bestSessionDate}>
                  {format(new Date(bestSession.start_time), 'dd/MM/yyyy')}
                </Text>
              </View>
              <View style={styles.bestSessionRight}>
                <Text style={styles.bestSessionPercent}>
                  {Math.round(bestSession.completion_percentage)}%
                </Text>
                <Text style={styles.bestSessionDuration}>
                  {bestSession.actual_duration} min
                </Text>
              </View>
            </LinearGradient>
          </Animatable.View>
        )}

        {/* Recent Sessions */}
        {recentSessions.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={700} style={styles.section}>
            <Text style={styles.sectionTitle}>📝 Recent Sessions</Text>
            {recentSessions.map((session, index) => {
              const completion = Math.round(session.completion_percentage);
              const completionColor =
                completion >= 90 ? '#43E97B'
                : completion >= 70 ? '#667EEA'
                : completion >= 50 ? '#F093FB'
                : '#F5576C';
              return (
                <Animatable.View
                  key={session.session_id || index}
                  animation="fadeInRight"
                  delay={100 * index}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                    style={styles.sessionCard}
                  >
                    <View style={styles.sessionTop}>
                      <Text style={styles.sessionMode}>{session.focus_mode}</Text>
                      <Text style={[styles.sessionPercent, { color: completionColor }]}>
                        {completion}%
                      </Text>
                    </View>
                    <View style={styles.sessionMid}>
                      <Text style={styles.sessionDuration}>
                        {session.actual_duration} / {session.planned_duration} min
                      </Text>
                      <Text style={styles.sessionDate}>
                        {format(new Date(session.start_time), 'dd/MM/yyyy')}
                      </Text>
                    </View>
                    <View style={styles.sessionProgressBg}>
                      <View
                        style={[
                          styles.sessionProgressFill,
                          {
                            width: `${Math.min(completion, 100)}%`,
                            backgroundColor: completionColor,
                          },
                        ]}
                      />
                    </View>
                  </LinearGradient>
                </Animatable.View>
              );
            })}
          </Animatable.View>
        )}

        {/* Insights */}
        <Animatable.View animation="fadeInUp" delay={800} style={styles.section}>
          <Text style={styles.sectionTitle}>💡 Insights</Text>
          <LinearGradient
            colors={['rgba(102,126,234,0.15)', 'rgba(118,75,162,0.05)']}
            style={styles.chartCard}
          >
            {sessions.length < 3 ? (
              <View style={styles.insightRow}>
                <Text style={styles.insightEmoji}>🌱</Text>
                <Text style={styles.insightText}>
                  Keep focusing to unlock insights!
                </Text>
              </View>
            ) : (
              <>
                {streak >= 3 && (
                  <View style={styles.insightRow}>
                    <Text style={styles.insightEmoji}>🔥</Text>
                    <Text style={styles.insightText}>
                      {streak} day streak! You're building great habits.
                    </Text>
                  </View>
                )}
                {stats.avgCompletion >= 80 && (
                  <View style={styles.insightRow}>
                    <Text style={styles.insightEmoji}>🎯</Text>
                    <Text style={styles.insightText}>
                      {stats.avgCompletion}% avg completion. Excellent!
                    </Text>
                  </View>
                )}
                {stats.totalMinutes >= 100 && (
                  <View style={styles.insightRow}>
                    <Text style={styles.insightEmoji}>🏆</Text>
                    <Text style={styles.insightText}>
                      {stats.totalMinutes} total minutes focused. Keep going!
                    </Text>
                  </View>
                )}
                {sessions.length >= 5 && (
                  <View style={styles.insightRow}>
                    <Text style={styles.insightEmoji}>📈</Text>
                    <Text style={styles.insightText}>
                      {sessions.length} sessions completed. You're on a roll!
                    </Text>
                  </View>
                )}
              </>
            )}
          </LinearGradient>
        </Animatable.View>

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  header: { alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', marginBottom: 6 },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.5)', letterSpacing: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 25 },
  statCard: { width: (width - 52) / 2, padding: 20, borderRadius: 20, alignItems: 'center' },
  statEmoji: { fontSize: 30, marginBottom: 8 },
  statValue: { fontSize: 26, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  statLabel: { fontSize: 12, color: 'rgba(255,255,255,0.85)', textAlign: 'center' },

  section: { marginBottom: 22 },
  sectionHeader: { marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 2 },
  sectionSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },

  chartCard: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },

  chartGlowBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  chartGlow: { flex: 1 },

  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
    paddingTop: 20,
  },
  barColumn: { alignItems: 'center', flex: 1 },
  barValue: { fontSize: 10, fontWeight: 'bold', marginBottom: 5 },
  barWrapper: { alignItems: 'center', justifyContent: 'flex-end', width: 30 },
  emptyBar: {
    width: 30,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
  },
  barGlow: {
    position: 'absolute',
    width: 30,
    borderRadius: 8,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 0,
    transform: [{ scaleX: 1.4 }],
  },
  bar: { width: 30, borderRadius: 8, zIndex: 1 },
  barLabel: { fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 8 },

  chartLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 8,
  },
  chartLegendLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  chartCaption: { fontSize: 11, color: 'rgba(255,255,255,0.35)', textAlign: 'center' },

  emptyChartText: {
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 20,
  },

  donutRow: { flexDirection: 'row', alignItems: 'center' },
  donutContainer: { alignItems: 'center', justifyContent: 'center', marginRight: 20 },
  donutOuter: {
    width: 110, height: 110, borderRadius: 55,
    overflow: 'hidden', alignItems: 'center', justifyContent: 'center',
  },
  donutGradient: { position: 'absolute', width: '100%', height: '100%' },
  donutInner: {
    width: 74, height: 74, borderRadius: 37,
    backgroundColor: '#1A1F3A', alignItems: 'center', justifyContent: 'center',
  },
  donutValue: { fontSize: 22, fontWeight: 'bold', color: 'white' },
  donutLabel: { fontSize: 10, color: 'rgba(255,255,255,0.6)' },
  donutLegend: { flex: 1 },
  legendRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  legendText: { flex: 1, fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  legendCount: { fontSize: 13, fontWeight: 'bold' },

  modeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  modeDot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  modeLabel: { fontSize: 13, color: 'rgba(255,255,255,0.8)', width: 70 },
  modeBarBg: {
    flex: 1, height: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4, marginHorizontal: 8, overflow: 'hidden',
  },
  modeBar: { height: 8, borderRadius: 4 },
  modeCount: { fontSize: 13, fontWeight: 'bold', width: 20, textAlign: 'right' },

  bestSessionCard: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', borderColor: 'rgba(255,215,0,0.3)',
  },
  bestSessionMode: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  bestSessionDate: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  bestSessionRight: { alignItems: 'flex-end' },
  bestSessionPercent: { fontSize: 28, fontWeight: 'bold', color: '#43E97B' },
  bestSessionDuration: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },

  sessionCard: {
    borderRadius: 16, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.07)',
  },
  sessionTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  sessionMode: { fontSize: 15, fontWeight: '600', color: 'white' },
  sessionPercent: { fontSize: 15, fontWeight: 'bold' },
  sessionMid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  sessionDuration: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  sessionDate: { fontSize: 12, color: 'rgba(255,255,255,0.5)' },
  sessionProgressBg: {
    height: 4, backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2, overflow: 'hidden',
  },
  sessionProgressFill: { height: 4, borderRadius: 2 },

  insightRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  insightEmoji: { fontSize: 24, marginRight: 12 },
  insightText: { flex: 1, fontSize: 13, color: 'rgba(255,255,255,0.8)', lineHeight: 20 },
});