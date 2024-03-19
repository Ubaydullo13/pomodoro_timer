import { useState, useEffect } from 'react';
import notification from '../assets/sounds/notification-sound.wav'
import './pomodoro.css'

const PomodoroTimer = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(25 * 60);
  const [intervalId, setIntervalId] = useState(null);
  const [isBreak, setIsBreak] = useState(false);
  const [cycles, setCycles] = useState(0);

  const countTimerCycles = (currentTime, isBreak, previousCycles = 0) => {
    if(currentTime === 0 && !isBreak) {
      return previousCycles + 1;
  }
    return previousCycles;
  }

  const startTimer = () => {
    setIsStarted(true);
    const newIntervalId = setInterval(() => {
      setCurrentTime((prevTime) => Math.max(prevTime - 1, 0));
    }, 1000);
    setIntervalId(newIntervalId);
  };

  const stopTimer = () => {
    setIsStarted(false);
    clearInterval(intervalId);
  };

  const handleShortBreak = () => {
    setIsBreak(true);
    setCurrentTime(5 * 60);
  };

  const resetTimer = () => {
    stopTimer();
    setIsBreak(false);
    setCurrentTime(isBreak ? 5 * 60 : 25 * 60);
  };

  useEffect(() => {
    setCycles((prevCycles) => countTimerCycles(currentTime, isBreak, prevCycles));
  }, [currentTime, isBreak])

  useEffect(() => {
    if (currentTime === 0) {
      const audio = new Audio(notification);
      audio.play();
      if (isBreak) {
        setIsBreak(false);
        setCurrentTime(25 * 60);
      } else {
        setIsBreak(true);
        setCurrentTime(5 * 60);
      }
    }
  }, [currentTime, isBreak]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="pomodoro-timer">
      <div className='count'>Pomodoro completions: {cycles}</div>
      <div className="timer-display">{formatTime(currentTime)}</div>
      <div className="controls">
        {isStarted ? (
          <button onClick={stopTimer}>Stop</button>
        ) : (
          <button onClick={startTimer}>Start</button>
        )}
        <button onClick={handleShortBreak} disabled={isStarted}>
          Short Break
        </button>
        <button onClick={resetTimer}>Reset</button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
