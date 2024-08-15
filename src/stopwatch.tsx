import React, { useState, useEffect, useRef } from 'react';

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalId = useRef(null);

  const handleStart = () => {
    setIsRunning(true);
    intervalId.current = setInterval(() => {
      setTime((prevTime) => prevTime + 10);
    }, 10);
  };

  const handleStop = () => {
    setIsRunning(false);
    clearInterval(intervalId.current);
  };

  const handleReset = () => {
    setIsRunning(false);
    clearInterval(intervalId.current);
    setTime(0);
  };

  const formatTime = (time) => {
    const milliseconds = ('00' + (time % 100)).slice(-2);
    const seconds = ('0' + Math.floor((time / 1000) % 60)).slice(-2);
    const minutes = ('0' + Math.floor((time / (1000 * 60)) % 60)).slice(-2);
    return `${minutes}:${seconds}:${milliseconds}`;
  };

  return (
    <div>
      <p>{formatTime(time)}</p>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}

export default Stopwatch;
