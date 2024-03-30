import React, { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [timeRemaining, setTimeRemaining] = useState(25 * 60);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);
  const [progressPercent, setProgressPercent] = useState(100);

  useEffect(() => {
    let interval = null;

    if (isRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(timeRemaining - 1);
        setProgressPercent(((timeRemaining - 1) / (isBreak ? breakDuration * 60 : workDuration * 60)) * 100);
      }, 1000);
    } else if (timeRemaining === 0) {
      if (isBreak) {
        setCompletedSessions(completedSessions + 1);
        setTimeRemaining(workDuration * 60);
        setIsBreak(false);
        playSound();
      } else {
        setTimeRemaining(breakDuration * 60);
        setIsBreak(true);
        playSound();
      }
    }

    return () => clearInterval(interval);
  }, [isRunning, timeRemaining, workDuration, breakDuration, isBreak, completedSessions]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setTimeRemaining(workDuration * 60);
    setIsRunning(false);
    setIsBreak(false);
    setCompletedSessions(0);
    setProgressPercent(100);
  };

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const playSound = () => {
    const audio = new Audio('/notification.mp3');
    audio.play();
  };

  return (
    <div className="app">
      <h1>Pomodoro Timer</h1>
      <div className="timer-container">
        <div className="timer">{formatTime(timeRemaining)}</div>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
      <div className="controls">
        <div className="duration-settings">
          <div>
            <label>Work Duration (minutes):</label>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
            />
          </div>
          <div>
            <label>Break Duration (minutes):</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(e.target.value)}
            />
          </div>
        </div>
        <div className="buttons">
          <button className="start-button" onClick={startTimer}>
            Start
          </button>
          <button className="pause-button" onClick={pauseTimer}>
            Pause
          </button>
          <button className="reset-button" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
      <div className="session-counter">Completed Sessions: {completedSessions}</div>
    </div>
  );
};

export default App;