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

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    throw error;
  }
};

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
