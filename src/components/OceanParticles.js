import { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("window");

export default function OceanParticles() {
  const particles = Array.from({ length: 5 }, (_, i) => ({
    id: i,
    anim: useRef(new Animated.Value(0)).current,
    left: Math.random() * width,
    delay: Math.random() * 2000,
  }));

  useEffect(() => {
    particles.forEach((particle) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(particle.anim, {
            toValue: -height,
            duration: 8000 + Math.random() * 4000,
            delay: particle.delay,
            useNativeDriver: true,
          }),
          Animated.timing(particle.anim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    });
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <Animated.Text
          key={particle.id}
          style={[
            styles.particle,
            {
              left: particle.left,
              transform: [{ translateY: particle.anim }],
            },
          ]}
        >
          ○
        </Animated.Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: "absolute",
    top: height,
    fontSize: 20,
    color: "rgba(255, 255, 255, 0.4)",
  },
});
