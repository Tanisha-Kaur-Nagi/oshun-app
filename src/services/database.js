import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('oshion.db');

// Initialize database tables
export const initDatabase = async () => {
  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT,
        created_at TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS focus_sessions (
        session_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        focus_mode TEXT NOT NULL,
        planned_duration INTEGER NOT NULL,
        actual_duration INTEGER NOT NULL,
        completion_percentage REAL NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT,
        is_interrupted INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS ocean_rewards (
        reward_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        session_id INTEGER NOT NULL,
        reward_type TEXT NOT NULL,
        reward_level TEXT NOT NULL,
        earned_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        FOREIGN KEY (session_id) REFERENCES focus_sessions (session_id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS blocked_apps (
        app_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        app_name TEXT NOT NULL,
        package_name TEXT NOT NULL,
        is_blocked INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_goals (
        goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        target_minutes INTEGER NOT NULL DEFAULT 60,
        achieved_minutes INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        UNIQUE(user_id, date)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        achievement_id TEXT NOT NULL,
        achievement_name TEXT NOT NULL,
        unlocked_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (user_id),
        UNIQUE(user_id, achievement_id)
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id INTEGER PRIMARY KEY,
        theme TEXT DEFAULT 'light',
        notifications_enabled INTEGER DEFAULT 1,
        sounds_enabled INTEGER DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES users (user_id)
      );
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

// ============ USER AUTHENTICATION FUNCTIONS ============

// Create new user account
export const createUser = async (username, password) => {
  try {
    // Check if username exists
    const existing = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (existing) {
      throw new Error('Username already exists');
    }

    // Insert new user
    const result = await db.runAsync(
      'INSERT INTO users (username, email, created_at) VALUES (?, ?, ?)',
      [username, password, new Date().toISOString()]
    );

    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// Login user
export const loginUser = async (username, password) => {
  try {
    const user = await db.getFirstAsync(
      'SELECT * FROM users WHERE username = ? AND email = ?',
      [username, password]
    );

    if (!user) {
      throw new Error('Invalid username or password');
    }

    return {
      userId: user.user_id,
      username: user.username,
    };
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Get all users (for debugging)
export const getAllUsers = async () => {
  try {
    const users = await db.getAllAsync('SELECT user_id, username FROM users');
    return users;
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// ============ FOCUS SESSION FUNCTIONS ============

// Insert focus session
export const insertFocusSession = async (session) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO focus_sessions 
      (user_id, focus_mode, planned_duration, actual_duration, 
       completion_percentage, start_time, end_time, is_interrupted) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        session.userId,
        session.focusMode,
        session.plannedDuration,
        session.actualDuration,
        session.completionPercentage,
        session.startTime,
        session.endTime,
        session.isInterrupted ? 1 : 0
      ]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting session:', error);
    throw error;
  }
};

// Get all focus sessions
export const getFocusSessions = async (userId) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM focus_sessions WHERE user_id = ? ORDER BY start_time DESC',
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

// Get statistics
export const getStatistics = async (userId) => {
  try {
    const totalResult = await db.getFirstAsync(
      'SELECT SUM(actual_duration) as totalMinutes FROM focus_sessions WHERE user_id = ?',
      [userId]
    );

    const countResult = await db.getFirstAsync(
      'SELECT COUNT(*) as count FROM focus_sessions WHERE user_id = ?',
      [userId]
    );

    const avgResult = await db.getFirstAsync(
      'SELECT AVG(completion_percentage) as avgCompletion FROM focus_sessions WHERE user_id = ?',
      [userId]
    );

    return {
      totalMinutes: totalResult?.totalMinutes || 0,
      sessionCount: countResult?.count || 0,
      avgCompletion: Math.round(avgResult?.avgCompletion || 0)
    };
  } catch (error) {
    console.error('Error getting statistics:', error);
    return {
      totalMinutes: 0,
      sessionCount: 0,
      avgCompletion: 0
    };
  }
};

// Get today's statistics
export const getTodayStats = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    const result = await db.getFirstAsync(
      `SELECT SUM(actual_duration) as totalMinutes, COUNT(*) as sessionCount 
       FROM focus_sessions 
       WHERE user_id = ? AND DATE(start_time) = ?`,
      [userId, today]
    );

    return {
      totalMinutes: result?.totalMinutes || 0,
      sessionCount: result?.sessionCount || 0
    };
  } catch (error) {
    console.error('Error getting today stats:', error);
    return {
      totalMinutes: 0,
      sessionCount: 0
    };
  }
};

// ============ REWARDS FUNCTIONS ============

// Insert reward
export const insertReward = async (reward) => {
  try {
    const result = await db.runAsync(
      `INSERT INTO ocean_rewards (user_id, session_id, reward_type, reward_level, earned_at)
       VALUES (?, ?, ?, ?, ?)`,
      [reward.userId, reward.sessionId, reward.rewardType, reward.rewardLevel, reward.earnedAt]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error('Error inserting reward:', error);
    throw error;
  }
};

// Get user rewards
export const getRewards = async (userId) => {
  try {
    const result = await db.getAllAsync(
      'SELECT * FROM ocean_rewards WHERE user_id = ? ORDER BY earned_at DESC',
      [userId]
    );
    return result;
  } catch (error) {
    console.error('Error getting rewards:', error);
    return [];
  }
};

// ============ GOALS FUNCTIONS ============

// Get or create today's goal
export const getTodayGoal = async (userId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Check if goal exists for today
    let goal = await db.getFirstAsync(
      'SELECT * FROM daily_goals WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    
    if (!goal) {
      // Create default goal (60 minutes)
      await db.runAsync(
        'INSERT INTO daily_goals (user_id, date, target_minutes, achieved_minutes) VALUES (?, ?, ?, ?)',
        [userId, today, 60, 0]
      );
      
      goal = await db.getFirstAsync(
        'SELECT * FROM daily_goals WHERE user_id = ? AND date = ?',
        [userId, today]
      );
    }
    
    return goal;
  } catch (error) {
    console.error('Error getting today goal:', error);
    return { target_minutes: 60, achieved_minutes: 0 };
  }
};

// Update daily goal progress
export const updateGoalProgress = async (userId, minutesToAdd) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // First, ensure goal exists for today
    await getTodayGoal(userId);
    
    // Then update it
    await db.runAsync(
      'UPDATE daily_goals SET achieved_minutes = achieved_minutes + ? WHERE user_id = ? AND date = ?',
      [minutesToAdd, userId, today]
    );
  } catch (error) {
    console.error('Error updating goal:', error);
  }
};

// Set daily goal target
export const setDailyGoalTarget = async (userId, targetMinutes) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Get current achieved minutes
    const current = await db.getFirstAsync(
      'SELECT achieved_minutes FROM daily_goals WHERE user_id = ? AND date = ?',
      [userId, today]
    );
    
    const achievedMinutes = current?.achieved_minutes || 0;
    
    // Insert or replace
    await db.runAsync(
      'INSERT OR REPLACE INTO daily_goals (user_id, date, target_minutes, achieved_minutes) VALUES (?, ?, ?, ?)',
      [userId, today, targetMinutes, achievedMinutes]
    );
  } catch (error) {
    console.error('Error setting goal:', error);
    throw error;
  }
};

// ============ ACHIEVEMENTS FUNCTIONS ============

// Get user achievements
export const getAchievements = async (userId) => {
  try {
    const achievements = await db.getAllAsync(
      'SELECT * FROM achievements WHERE user_id = ? ORDER BY unlocked_at DESC',
      [userId]
    );
    return achievements;
  } catch (error) {
    console.error('Error getting achievements:', error);
    return [];
  }
};

// Unlock achievement
export const unlockAchievement = async (userId, achievementId, achievementName) => {
  try {
    // Check if already unlocked
    const existing = await db.getFirstAsync(
      'SELECT * FROM achievements WHERE user_id = ? AND achievement_id = ?',
      [userId, achievementId]
    );
    
    if (!existing) {
      await db.runAsync(
        'INSERT INTO achievements (user_id, achievement_id, achievement_name, unlocked_at) VALUES (?, ?, ?, ?)',
        [userId, achievementId, achievementName, new Date().toISOString()]
      );
      return true; // New achievement unlocked
    }
    
    return false; // Already unlocked
  } catch (error) {
    console.error('Error unlocking achievement:', error);
    return false;
  }
};

// ============ ANALYTICS FUNCTIONS ============

// Calculate current streak
export const getCurrentStreak = async (userId) => {
  try {
    const sessions = await db.getAllAsync(
      'SELECT DISTINCT DATE(start_time) as date FROM focus_sessions WHERE user_id = ? ORDER BY date DESC',
      [userId]
    );
    
    if (sessions.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date);
      const expectedDate = new Date(today);
      expectedDate.setDate(expectedDate.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);
      
      if (sessionDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  } catch (error) {
    console.error('Error calculating streak:', error);
    return 0;
  }
};

// Get interruption analytics (hourly breakdown)
export const getInterruptionAnalytics = async (userId) => {
  try {
    const sessions = await db.getAllAsync(
      `SELECT 
        CAST(strftime('%H', start_time) AS INTEGER) as hour,
        COUNT(*) as total_sessions,
        SUM(CASE WHEN is_interrupted = 1 THEN 1 ELSE 0 END) as interrupted_sessions
       FROM focus_sessions 
       WHERE user_id = ?
       GROUP BY hour
       ORDER BY hour`,
      [userId]
    );
    
    return sessions;
  } catch (error) {
    console.error('Error getting interruption analytics:', error);
    return [];
  }
};

// ============ DATA EXPORT ============

// Export all data for backup
export const exportAllData = async (userId) => {
  try {
    const [sessions, rewards, goals, achievements] = await Promise.all([
      getFocusSessions(userId),
      getRewards(userId),
      db.getAllAsync('SELECT * FROM daily_goals WHERE user_id = ?', [userId]),
      getAchievements(userId),
    ]);

    return {
      sessions,
      rewards,
      goals,
      achievements,
      exportedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error exporting data:', error);
    throw error;
  }
};