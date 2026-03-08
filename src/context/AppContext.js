import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getFocusSessions,
  getRewards,
  getStatistics,
  getTodayStats,
  initDatabase,
} from "../services/database";

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState({ userId: 1, username: "Student" });
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentSession, setCurrentSession] = useState(null);
  const [isSessionActive, setIsSessionActive] = useState(false);
  // Initialize database when app starts
  useEffect(() => {
    console.log("🔵 Initializing database...");
    initDatabase()
      .then(() => {
        console.log("✅ Database initialized successfully");
        loadData();
      })
      .catch((error) => {
        console.error("❌ Database init failed:", error);
        setIsLoading(false);
      });
  }, []);

  // Load all data from database
  const loadData = async () => {
    try {
      console.log("📊 Loading data from database...");

      const fetchedSessions = await getFocusSessions(user.userId);
      const fetchedStats = await getStatistics(user.userId);
      const fetchedRewards = await getRewards(user.userId);
      const fetchedTodayStats = await getTodayStats(user.userId);

      setSessions(fetchedSessions);
      setStats(fetchedStats);
      setRewards(fetchedRewards);
      setTodayStats(fetchedTodayStats);

      console.log("✅ Data loaded successfully:", {
        sessions: fetchedSessions.length,
        totalMinutes: fetchedStats.totalMinutes,
        todayMinutes: fetchedTodayStats.totalMinutes,
        rewards: fetchedRewards.length,
      });

      setIsLoading(false);
    } catch (error) {
      console.error("❌ Error loading data:", error);
      setIsLoading(false);
    }
  };

  // Refresh data (call this after adding new sessions)
  const refreshData = () => {
    console.log("🔄 Refreshing data...");
    loadData();
  };

  return (
    <AppContext.Provider
      value={{
        user,
        sessions,
        stats,
        todayStats,
        rewards,
        isLoading,
        currentSession,
        setCurrentSession,
        isSessionActive,
        setIsSessionActive,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
