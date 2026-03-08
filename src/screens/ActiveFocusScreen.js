import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    BackHandler,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useApp } from "../context/AppContext";
import { insertFocusSession, insertReward } from "../services/database";
import TimerService from "../services/timer";
import { calculateRewardLevel } from "../utils/focusModes";

export default function ActiveFocusScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { user, refreshData, setIsSessionActive } = useApp();

  const [timerState, setTimerState] = useState({
    remainingSeconds: 0,
    formattedTime: "00:00",
    progress: 0,
    isPaused: false,
  });
  const [sessionStartTime] = useState(new Date().toISOString());

  const modeName = params.modeName || "Focus";
  const modeIcon = params.modeIcon || "🌊";
  const duration = parseInt(params.duration) || 25;

  useEffect(() => {
    // Start timer
    setIsSessionActive(true);
    TimerService.start(
      duration,
      (remainingSeconds) => {
        // On tick
        setTimerState(TimerService.getState());
      },
      () => {
        // On complete
        handleSessionComplete(false);
      },
    );

    // Prevent back button
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        Alert.alert(
          "End Session?",
          "Are you sure you want to end this focus session?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "End Session", onPress: () => handleSessionComplete(true) },
          ],
        );
        return true;
      },
    );

    return () => {
      TimerService.stop();
      setIsSessionActive(false);
      backHandler.remove();
    };
  }, []);

  const handlePauseResume = () => {
    if (timerState.isPaused) {
      TimerService.resume();
    } else {
      TimerService.pause();
    }
    setTimerState(TimerService.getState());
  };

  const handleStop = () => {
    Alert.alert(
      "End Session Early?",
      "Your progress will be saved, but you may receive a smaller reward.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "End Session",
          style: "destructive",
          onPress: () => handleSessionComplete(true),
        },
      ],
    );
  };

  const handleSessionComplete = async (interrupted) => {
    TimerService.stop();
    setIsSessionActive(false);

    const actualDuration = TimerService.getActualDuration();
    const completionPercentage = TimerService.getCompletionPercentage();
    const reward = calculateRewardLevel(completionPercentage);

    try {
      // Save session to database
      const sessionId = await insertFocusSession({
        userId: user.userId,
        focusMode: modeName,
        plannedDuration: duration,
        actualDuration: actualDuration,
        completionPercentage: completionPercentage,
        startTime: sessionStartTime,
        endTime: new Date().toISOString(),
        isInterrupted: interrupted,
      });

      // Save reward if earned
      if (reward.level !== "none") {
        await insertReward({
          userId: user.userId,
          sessionId: sessionId,
          rewardType: "coral",
          rewardLevel: reward.level,
          earnedAt: new Date().toISOString(),
        });
      }

      // Refresh data
      refreshData();

      // Show completion message
      Alert.alert(
        interrupted ? "Session Ended" : "🎉 Session Complete!",
        `You focused for ${actualDuration} minutes (${completionPercentage}%)\n\nReward: ${reward.emoji} ${reward.name}`,
        [
          {
            text: "OK",
            onPress: () => router.replace("/(tabs)"),
          },
        ],
      );
    } catch (error) {
      console.error("Error saving session:", error);
      Alert.alert("Error", "Failed to save session. Please try again.");
      router.replace("/(tabs)");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.modeIcon}>{modeIcon}</Text>
        <Text style={styles.modeName}>{modeName}</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <View
            style={[
              styles.progressBar,
              { height: `${timerState.progress * 100}%` },
            ]}
          />
        </View>

        <Text style={styles.timerText}>{timerState.formattedTime}</Text>
        <Text style={styles.progressText}>
          {Math.round(timerState.progress * 100)}% Complete
        </Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlButton, styles.pauseButton]}
          onPress={handlePauseResume}
        >
          <Text style={styles.controlButtonText}>
            {timerState.isPaused ? "▶️ Resume" : "⏸️ Pause"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={handleStop}
        >
          <Text style={styles.controlButtonText}>⏹️ Stop</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.motivationBox}>
        <Text style={styles.motivationText}>
          {timerState.isPaused
            ? "⏸️ Paused - Take a breath and resume when ready"
            : "🌊 Stay focused! Your ocean is growing..."}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0077BE",
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  modeIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  modeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  timerContainer: {
    alignItems: "center",
    marginBottom: 60,
  },
  progressRing: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
    position: "relative",
  },
  progressBar: {
    width: "100%",
    backgroundColor: "rgba(76, 175, 80, 0.5)",
    position: "absolute",
    bottom: 0,
  },
  timerText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "white",
    position: "absolute",
    top: "40%",
  },
  progressText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 40,
  },
  controlButton: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 12,
    minWidth: 140,
    alignItems: "center",
  },
  pauseButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  stopButton: {
    backgroundColor: "rgba(255,0,0,0.4)",
  },
  controlButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  motivationBox: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
  },
  motivationText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});
