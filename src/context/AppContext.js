import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import {
  initDatabase,
  getFocusSessions,
  getStatistics,
  getTodayStats,
  getRewards,
  getTodayGoal,
  getAchievements,
  getCurrentStreak,
  updateGoalProgress as dbUpdateGoalProgress,
} from '../services/database';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
    avgCompletion: 0,
  });
  const [todayStats, setTodayStats] = useState({
    totalMinutes: 0,
    sessionCount: 0,
  });
  const [rewards, setRewards] = useState([]);
  const [todayGoal, setTodayGoal] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [settings, setSettings] = useState({
    theme: 'dark',
    notificationsEnabled: true,
    soundsEnabled: true,
  });

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log('Initializing database...');
        await initDatabase();
        console.log('Database initialized');

        const savedUser = await AsyncStorage.getItem('@logged_in_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
          await loadData(userData.userId);
        }
      } catch (error) {
        console.error('Initialization error:', error);
        Alert.alert('Error', 'Failed to initialize app: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const loadData = async (userId) => {
    if (!userId) return;
    try {
      const sessionsData = await getFocusSessions(userId);
      const statsData = await getStatistics(userId);
      const todayStatsData = await getTodayStats(userId);
      const rewardsData = await getRewards(userId);
      const goalData = await getTodayGoal(userId);
      const achievementsData = await getAchievements(userId);
      const streakData = await getCurrentStreak(userId);

      setSessions(sessionsData || []);
      setStats(statsData || { totalMinutes: 0, sessionCount: 0, avgCompletion: 0 });
      setTodayStats(todayStatsData || { totalMinutes: 0, sessionCount: 0 });
      setRewards(rewardsData || []);
      setTodayGoal(goalData);
      setAchievements(achievementsData || []);
      setStreak(streakData || 0);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const refreshData = async () => {
    if (user?.userId) {
      await loadData(user.userId);
    }
  };

  const handleLogin = async (userData) => {
    try {
      setUser(userData);
      setIsAuthenticated(true);
      await AsyncStorage.setItem('@logged_in_user', JSON.stringify(userData));
      await loadData(userData.userId);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('@logged_in_user');
      setUser(null);
      setIsAuthenticated(false);
      setSessions([]);
      setStats({ totalMinutes: 0, sessionCount: 0, avgCompletion: 0 });
      setRewards([]);
      setAchievements([]);
      setStreak(0);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateSettings = async (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const sendSessionNotification = () => {
    if (settings.notificationsEnabled) {
      Alert.alert('Focus Time', 'Keep up the great work!');
    }
  };

  const updateGoalProgressFunc = async (userId, minutes) => {
    try {
      await dbUpdateGoalProgress(userId, minutes);
      await refreshData();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sessions,
    stats,
    todayStats,
    rewards,
    todayGoal,
    achievements,
    streak,
    isSessionActive,
    settings,
    loadData,
    refreshData,
    handleLogin,
    handleLogout,
    setIsSessionActive,
    updateSettings,
    sendSessionNotification,
    updateGoalProgress: updateGoalProgressFunc,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
