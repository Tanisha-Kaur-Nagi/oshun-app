import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');

// Bubble component — each bubble floats up independently
function Bubble({ size, left, delay, duration }) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(0);
      opacity.setValue(0);
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -height * 0.6,
            duration: duration,
            useNativeDriver: true,
          }),
          Animated.sequence([
            Animated.timing(opacity, { toValue: 0.7, duration: 400, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0.7, duration: duration - 800, useNativeDriver: true }),
            Animated.timing(opacity, { toValue: 0, duration: 400, useNativeDriver: true }),
          ]),
        ]),
      ]).start(() => animate());
    };
    animate();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        bottom: 60,
        left,
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: 'rgba(150,220,255,0.35)',
        borderWidth: 1,
        borderColor: 'rgba(200,240,255,0.5)',
        transform: [{ translateY }],
        opacity,
      }}
    />
  );
}

// Light Ray component
function LightRay({ left, opacity: opacityVal, width: rayWidth, delay }) {
  const anim = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: opacityVal, duration: 2500 + delay, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0.1, duration: 2500 + delay, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left,
        width: rayWidth,
        height: height * 0.65,
        opacity: anim,
        transform: [{ skewX: '8deg' }],
      }}
    >
      <LinearGradient
        colors={['rgba(120,200,255,0.35)', 'rgba(60,140,220,0.08)', 'transparent']}
        style={{ flex: 1 }}
      />
    </Animated.View>
  );
}

// Floating creature card (unlocked)
function CreatureCard({ icon, name, count, index }) {
  return (
    <Animatable.View
      animation="bounceIn"
      delay={index * 80}
      style={styles.creatureCard}
    >
      <LinearGradient
        colors={['rgba(0,180,255,0.25)', 'rgba(0,80,180,0.35)']}
        style={styles.creatureGradient}
      >
        <Animatable.Text
          animation="swing"
          iterationCount="infinite"
          duration={2000 + index * 300}
          style={styles.creatureIcon}
        >
          {icon}
        </Animatable.Text>
        {count > 1 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>×{count}</Text>
          </View>
        )}
        <Text style={styles.creatureName}>{name}</Text>
      </LinearGradient>
    </Animatable.View>
  );
}

// Locked creature card
function LockedCard({ name, unlockAt, index }) {
  return (
    <Animatable.View animation="fadeIn" delay={index * 60} style={styles.creatureCard}>
      <View style={styles.lockedGradient}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockedName}>{name}</Text>
        <Text style={styles.unlockHint}>at {unlockAt} 🎁</Text>
      </View>
    </Animatable.View>
  );
}

export default function OceanScreen() {
  const { rewards } = useApp();

  const oceanLevel = Math.min(Math.floor(rewards.length / 3) + 1, 10);
  const fullCorals = rewards.filter((r) => r.reward_level === 'full').length;
  const mediumCorals = rewards.filter((r) => r.reward_level === 'medium').length;
  const smallCorals = rewards.filter((r) => r.reward_level === 'small').length;
  const marineLife = rewards.length;

  const nextLevel = oceanLevel * 3 + 2;
  const progressPct = Math.min((rewards.length / nextLevel) * 100, 100);

  const ecosystemElements = [
    { icon: '🌺', name: 'Full Coral',     count: fullCorals,   unlockAt: 0  },
    { icon: '🪸', name: 'Medium Coral',   count: mediumCorals, unlockAt: 0  },
    { icon: '🌱', name: 'Small Coral',    count: smallCorals,  unlockAt: 0  },
    { icon: '🦀', name: 'Crab',           count: rewards.length >= 7  ? 1 : 0, unlockAt: 7  },
    { icon: '⭐', name: 'Starfish',       count: rewards.length >= 10 ? 1 : 0, unlockAt: 10 },
    { icon: '🐠', name: 'Tropical Fish',  count: rewards.length >= 5  ? 1 : 0, unlockAt: 5  },
    { icon: '🐟', name: 'Ocean Fish',     count: rewards.length >= 8  ? 1 : 0, unlockAt: 8  },
    { icon: '🐡', name: 'Pufferfish',     count: rewards.length >= 12 ? 1 : 0, unlockAt: 12 },
    { icon: '🦑', name: 'Squid',          count: rewards.length >= 14 ? 1 : 0, unlockAt: 14 },
    { icon: '🦈', name: 'Shark',          count: rewards.length >= 15 ? 1 : 0, unlockAt: 15 },
    { icon: '🐙', name: 'Octopus',        count: rewards.length >= 20 ? 1 : 0, unlockAt: 20 },
    { icon: '🐬', name: 'Dolphin',        count: rewards.length >= 25 ? 1 : 0, unlockAt: 25 },
    { icon: '🐳', name: 'Whale',          count: rewards.length >= 30 ? 1 : 0, unlockAt: 30 },
  ];

  const unlocked = ecosystemElements.filter((e) => rewards.length >= e.unlockAt && e.count > 0);
  const locked   = ecosystemElements.filter((e) => rewards.length < e.unlockAt || e.count === 0);

  const bubbles = [
    { size: 8,  left: 30,         delay: 0,    duration: 6000 },
    { size: 5,  left: 80,         delay: 1200, duration: 5500 },
    { size: 10, left: 140,        delay: 600,  duration: 7000 },
    { size: 6,  left: 200,        delay: 2000, duration: 5000 },
    { size: 8,  left: width-60,   delay: 300,  duration: 6500 },
    { size: 5,  left: width-120,  delay: 1800, duration: 5800 },
    { size: 7,  left: width/2,    delay: 900,  duration: 6200 },
    { size: 4,  left: width/2+40, delay: 2500, duration: 5200 },
  ];

  const lightRays = [
    { left: -20,        opacity: 0.4, width: 90,  delay: 0    },
    { left: 60,         opacity: 0.3, width: 60,  delay: 800  },
    { left: 150,        opacity: 0.5, width: 110, delay: 400  },
    { left: width-180,  opacity: 0.35,width: 80,  delay: 1200 },
    { left: width-80,   opacity: 0.4, width: 100, delay: 200  },
  ];

  return (
    <View style={styles.container}>

      {/* ── OCEAN BACKGROUND ── */}
      <LinearGradient
        colors={['#020B18', '#041830', '#062848', '#083860', '#0A4878']}
        locations={[0, 0.2, 0.45, 0.7, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Light Rays from surface */}
      {lightRays.map((r, i) => (
        <LightRay key={i} {...r} />
      ))}

      {/* Floating Bubbles */}
      {bubbles.map((b, i) => (
        <Bubble key={i} {...b} />
      ))}

      {/* Sea floor gradient */}
      <LinearGradient
        colors={['transparent', 'rgba(2,8,20,0.85)']}
        style={styles.seaFloor}
      />

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Animatable.View animation="fadeInDown" style={styles.header}>
          <Text style={styles.title}>🌊 Your Ocean</Text>
          <Text style={styles.subtitle}>Build your ecosystem through focus</Text>
        </Animatable.View>

        {/* Ocean Level Card */}
        <Animatable.View animation="fadeInUp" delay={150} style={styles.levelCard}>
          <LinearGradient
            colors={['rgba(0,140,255,0.35)', 'rgba(0,60,160,0.5)']}
            style={styles.levelGradient}
          >
            {/* Glow circle */}
            <View style={styles.levelGlowCircle}>
              <Text style={styles.levelNumber}>{oceanLevel}</Text>
            </View>
            <View style={styles.levelInfo}>
              <Text style={styles.levelTitle}>Ocean Level {oceanLevel}</Text>
              <Text style={styles.levelSub}>{rewards.length} / {nextLevel} rewards collected</Text>
              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <Animatable.View
                  animation="slideInLeft"
                  delay={400}
                  style={[styles.progressBarFill, { width: `${progressPct}%` }]}
                />
              </View>
              <Text style={styles.progressPct}>{Math.round(progressPct)}% to next level</Text>
            </View>
          </LinearGradient>
        </Animatable.View>

        {/* Stats Row */}
        <Animatable.View animation="fadeInUp" delay={250} style={styles.statsRow}>
          {[
            { icon: '🎯', value: rewards.length, label: 'Total Rewards',  colors: ['rgba(0,160,255,0.3)','rgba(0,80,200,0.4)']  },
            { icon: '🌺', value: fullCorals,      label: 'Full Corals',    colors: ['rgba(240,100,200,0.3)','rgba(160,40,180,0.4)'] },
            { icon: '🐠', value: unlocked.filter(e=>e.unlockAt>0).length, label: 'Marine Life', colors: ['rgba(0,200,160,0.3)','rgba(0,120,100,0.4)'] },
          ].map((s, i) => (
            <Animatable.View key={i} animation="zoomIn" delay={300 + i * 100}>
              <LinearGradient colors={s.colors} style={styles.statCard}>
                <Text style={styles.statIcon}>{s.icon}</Text>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </LinearGradient>
            </Animatable.View>
          ))}
        </Animatable.View>

        {/* ── UNLOCKED CREATURES ── */}
        {unlocked.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={350}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✨ Your Collection</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{unlocked.length} unlocked</Text>
              </View>
            </View>
            <View style={styles.creaturesGrid}>
              {unlocked.map((el, i) => (
                <CreatureCard key={i} index={i} icon={el.icon} name={el.name} count={el.count} />
              ))}
            </View>
          </Animatable.View>
        )}

        {/* ── LOCKED CREATURES ── */}
        {locked.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={450}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🔒 Still Locked</Text>
              <View style={[styles.sectionBadge, { backgroundColor: 'rgba(255,255,255,0.08)' }]}>
                <Text style={styles.sectionBadgeText}>{locked.length} remaining</Text>
              </View>
            </View>
            <View style={styles.creaturesGrid}>
              {locked.map((el, i) => (
                <LockedCard key={i} index={i} name={el.name} unlockAt={el.unlockAt} />
              ))}
            </View>
          </Animatable.View>
        )}

        {/* Empty State */}
        {rewards.length === 0 && (
          <Animatable.View animation="fadeIn" delay={300} style={styles.emptyState}>
            <Animatable.Text animation="pulse" iterationCount="infinite" style={styles.emptyEmoji}>
              🌊
            </Animatable.Text>
            <Text style={styles.emptyTitle}>Your Ocean Awaits</Text>
            <Text style={styles.emptyText}>
              Complete focus sessions to start building your ocean ecosystem.
              Each session earns coral rewards based on your focus quality!
            </Text>
          </Animatable.View>
        )}

        {/* Next Unlock Tip */}
        {rewards.length > 0 && (
          <Animatable.View animation="fadeInUp" delay={500}>
            <LinearGradient
              colors={['rgba(0,140,255,0.15)', 'rgba(0,60,160,0.2)']}
              style={styles.tipCard}
            >
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={styles.tipText}>
                {rewards.length < 5
                  ? `${5 - rewards.length} more rewards to unlock Tropical Fish! 🐠`
                  : rewards.length < 10
                  ? `${10 - rewards.length} more rewards to unlock Starfish! ⭐`
                  : rewards.length < 15
                  ? `${15 - rewards.length} more rewards to unlock Shark! 🦈`
                  : rewards.length < 25
                  ? `${25 - rewards.length} more rewards to unlock Dolphin! 🐬`
                  : 'Amazing ocean! Keep focusing to reach max level! 🐳'}
              </Text>
            </LinearGradient>
          </Animatable.View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const CARD_SIZE = (width - 56) / 3;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020B18' },
  seaFloor: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },

  // Header
  header: { alignItems: 'center', marginBottom: 22 },
  title: { fontSize: 30, fontWeight: 'bold', color: 'white', letterSpacing: 1, textShadowColor: 'rgba(0,160,255,0.8)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 12 },
  subtitle: { fontSize: 13, color: 'rgba(160,220,255,0.7)', marginTop: 4, letterSpacing: 0.5 },

  // Level Card
  levelCard: { borderRadius: 22, overflow: 'hidden', marginBottom: 18, borderWidth: 1, borderColor: 'rgba(0,160,255,0.3)' },
  levelGradient: { flexDirection: 'row', alignItems: 'center', padding: 18, gap: 16 },
  levelGlowCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(0,160,255,0.25)',
    borderWidth: 2, borderColor: 'rgba(0,200,255,0.6)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#00C8FF', shadowOffset: { width: 0, height: 0 }, shadowRadius: 12, shadowOpacity: 0.8,
  },
  levelNumber: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  levelInfo: { flex: 1 },
  levelTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 3 },
  levelSub: { fontSize: 12, color: 'rgba(160,220,255,0.75)', marginBottom: 8 },
  progressBarBg: { height: 6, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#00C8FF', borderRadius: 3 },
  progressPct: { fontSize: 11, color: 'rgba(0,200,255,0.7)', marginTop: 4 },

  // Stats
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 22, justifyContent: 'space-between' },
  statCard: { width: (width - 60) / 3, paddingVertical: 14, paddingHorizontal: 8, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  statIcon: { fontSize: 26, marginBottom: 6 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 2 },
  statLabel: { fontSize: 10, color: 'rgba(160,220,255,0.7)', textAlign: 'center' },

  // Section header
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', color: 'white' },
  sectionBadge: { backgroundColor: 'rgba(0,160,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(0,160,255,0.35)' },
  sectionBadgeText: { fontSize: 11, color: 'rgba(160,220,255,0.9)', fontWeight: '600' },

  // Creatures grid
  creaturesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 22 },

  // Unlocked creature card
  creatureCard: { width: CARD_SIZE, borderRadius: 18, overflow: 'hidden' },
  creatureGradient: {
    padding: 12, alignItems: 'center', minHeight: 110,
    borderWidth: 1, borderColor: 'rgba(0,180,255,0.35)',
    justifyContent: 'center',
  },
  creatureIcon: { fontSize: 38, marginBottom: 6 },
  creatureName: { fontSize: 11, color: 'rgba(200,240,255,0.9)', fontWeight: '600', textAlign: 'center' },
  countBadge: {
    position: 'absolute', top: 7, right: 7,
    backgroundColor: 'rgba(0,160,255,0.7)',
    borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2,
  },
  countText: { color: 'white', fontSize: 10, fontWeight: 'bold' },

  // Locked creature card
  lockedGradient: {
    padding: 12, alignItems: 'center', minHeight: 110,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 18, justifyContent: 'center',
  },
  lockIcon: { fontSize: 26, marginBottom: 5, opacity: 0.5 },
  lockedName: { fontSize: 10, color: 'rgba(255,255,255,0.35)', fontWeight: '600', textAlign: 'center', marginBottom: 3 },
  unlockHint: { fontSize: 10, color: 'rgba(0,160,255,0.45)', textAlign: 'center' },

  // Empty state
  emptyState: { alignItems: 'center', paddingVertical: 50 },
  emptyEmoji: { fontSize: 70, marginBottom: 16 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  emptyText: { fontSize: 14, color: 'rgba(160,220,255,0.65)', textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },

  // Tip card
  tipCard: { padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(0,160,255,0.2)', marginBottom: 10 },
  tipIcon: { fontSize: 22, marginRight: 12 },
  tipText: { flex: 1, fontSize: 13, color: 'rgba(200,240,255,0.85)', lineHeight: 19 },
});