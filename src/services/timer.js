// Timer service - handles countdown logic
class TimerService {
  constructor() {
    this.timer = null;
    this.remainingSeconds = 0;
    this.totalSeconds = 0;
    this.isPaused = false;
    this.startTime = null;
    this.callbacks = {
      onTick: null,
      onComplete: null,
    };
  }

  // Start timer with duration in minutes
  start(minutes, onTick, onComplete) {
    this.totalSeconds = minutes * 60;
    this.remainingSeconds = this.totalSeconds;
    this.isPaused = false;
    this.startTime = new Date();
    this.callbacks.onTick = onTick;
    this.callbacks.onComplete = onComplete;

    this._runTimer();
  }

  // Internal timer loop
  _runTimer() {
    this.timer = setInterval(() => {
      if (!this.isPaused && this.remainingSeconds > 0) {
        this.remainingSeconds--;

        if (this.callbacks.onTick) {
          this.callbacks.onTick(this.remainingSeconds);
        }

        if (this.remainingSeconds === 0) {
          this.complete();
        }
      }
    }, 1000);
  }

  // Pause timer
  pause() {
    this.isPaused = true;
  }

  // Resume timer
  resume() {
    this.isPaused = false;
  }

  // Stop timer (interruption)
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  // Complete timer normally
  complete() {
    this.stop();
    if (this.callbacks.onComplete) {
      this.callbacks.onComplete();
    }
  }

  // Get actual focused time in minutes
  getActualDuration() {
    const focusedSeconds = this.totalSeconds - this.remainingSeconds;
    return Math.floor(focusedSeconds / 60);
  }

  // Get completion percentage
  getCompletionPercentage() {
    const focusedSeconds = this.totalSeconds - this.remainingSeconds;
    return Math.round((focusedSeconds / this.totalSeconds) * 100);
  }

  // Format seconds to MM:SS
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  // Get current state
  getState() {
    return {
      remainingSeconds: this.remainingSeconds,
      totalSeconds: this.totalSeconds,
      isPaused: this.isPaused,
      formattedTime: this.formatTime(this.remainingSeconds),
      progress:
        this.totalSeconds > 0
          ? (this.totalSeconds - this.remainingSeconds) / this.totalSeconds
          : 0,
    };
  }
}

export default new TimerService();
