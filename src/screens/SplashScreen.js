import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";
import * as Animatable from "react-native-animatable";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ onFinish }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    // Exit animation
    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start(() => onFinish());
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <LinearGradient
      colors={["#0A0E27", "#1A1F3A", "#2D1B69", "#1A1F3A", "#0A0E27"]}
      locations={[0, 0.25, 0.5, 0.75, 1]}
      style={styles.container}
    >
      {/* Animated circles background */}
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={3000}
        style={[styles.circle, styles.circle1]}
      />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={4000}
        delay={500}
        style={[styles.circle, styles.circle2]}
      />
      <Animatable.View
        animation="pulse"
        iterationCount="infinite"
        duration={3500}
        delay={1000}
        style={[styles.circle, styles.circle3]}
      />

      {/* Main content */}
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glowing logo container */}
        <Animated.View style={[styles.logoContainer, { opacity: glowOpacity }]}>
          <LinearGradient
            colors={["#667EEA", "#764BA2", "#F093FB"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradient}
          >
            <Text style={styles.logoEmoji}>🌊</Text>
          </LinearGradient>
        </Animated.View>

        {/* App name with gradient */}
        <Animatable.View animation="fadeInUp" delay={400}>
          <LinearGradient
            colors={["#667EEA", "#764BA2"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nameGradient}
          >
            <Text style={styles.appName}>OSHUN</Text>
          </LinearGradient>
        </Animatable.View>

        {/* Tagline */}
        <Animatable.Text
          animation="fadeInUp"
          delay={600}
          style={styles.tagline}
        >
          Digital Focus Regulator
        </Animatable.Text>

        {/* Loading dots */}
        <Animatable.View
          animation="fadeInUp"
          delay={800}
          style={styles.loadingContainer}
        >
          <Animatable.View
            animation="bounce"
            iterationCount="infinite"
            duration={1000}
            style={[styles.dot, { backgroundColor: "#667EEA" }]}
          />
          <Animatable.View
            animation="bounce"
            iterationCount="infinite"
            duration={1000}
            delay={200}
            style={[styles.dot, { backgroundColor: "#764BA2" }]}
          />
          <Animatable.View
            animation="bounce"
            iterationCount="infinite"
            duration={1000}
            delay={400}
            style={[styles.dot, { backgroundColor: "#F093FB" }]}
          />
        </Animatable.View>
      </Animated.View>

      {/* Footer */}
      <Animatable.View animation="fadeInUp" delay={1000} style={styles.footer}>
        <Text style={styles.footerText}>Dive into Focus</Text>
      </Animatable.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    position: "absolute",
    borderRadius: 1000,
    opacity: 0.1,
  },
  circle1: {
    width: 400,
    height: 400,
    backgroundColor: "#667EEA",
    top: -100,
    right: -100,
  },
  circle2: {
    width: 300,
    height: 300,
    backgroundColor: "#764BA2",
    bottom: -50,
    left: -50,
  },
  circle3: {
    width: 200,
    height: 200,
    backgroundColor: "#F093FB",
    top: height / 2,
    left: width / 2,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  logoContainer: {
    marginBottom: 40,
  },
  logoGradient: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#667EEA",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  logoEmoji: {
    fontSize: 90,
  },
  nameGradient: {
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 20,
  },
  appName: {
    fontSize: 64,
    fontWeight: "900",
    color: "white",
    letterSpacing: 8,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.7)",
    letterSpacing: 3,
    marginTop: 15,
    textTransform: "uppercase",
  },
  loadingContainer: {
    flexDirection: "row",
    marginTop: 50,
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  footer: {
    position: "absolute",
    bottom: 50,
  },
  footerText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: 2,
  },
});
