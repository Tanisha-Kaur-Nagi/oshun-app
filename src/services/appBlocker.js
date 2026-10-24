 import { AppState } from 'react-native';

class AppBlockerService {
  constructor() {
    this.interruptionCount = 0;
    this.isMonitoring = false;
    this.onInterruptionCallback = null;
    this.appStateSubscription = null;
    this.blockedApps = [];
  }

  startMonitoring(blockedApps = [], onInterruption = null) {
    this.interruptionCount = 0;
    this.isMonitoring = true;
    this.blockedApps = blockedApps;
    this.onInterruptionCallback = onInterruption;
    this.appStateSubscription = AppState.addEventListener(
      'change',
      this.handleAppStateChange
    );
  }

  handleAppStateChange = (nextAppState) => {
    if (!this.isMonitoring) return;
    if (nextAppState === 'background' || nextAppState === 'inactive') {
      this.interruptionCount++;
      if (this.onInterruptionCallback) {
        this.onInterruptionCallback(this.interruptionCount);
      }
    }
  };

  stopMonitoring() {
    this.isMonitoring = false;
    if (this.appStateSubscription) {
      this.appStateSubscription.remove();
      this.appStateSubscription = null;
    }
    return this.interruptionCount;
  }

  getInterruptionCount() {
    return this.interruptionCount;
  }

  reset() {
    this.interruptionCount = 0;
    this.isMonitoring = false;
    this.blockedApps = [];
    this.onInterruptionCallback = null;
  }
}

export default new AppBlockerService();
