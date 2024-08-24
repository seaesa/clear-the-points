import { memo, useEffect, useState } from 'react';

function Time({ onPlay, resetTime }: { onPlay: boolean, resetTime: boolean }) {
  const [seconds, setSeconds] = useState(0);
  const [milliSeconds, setMilliseconds] = useState(0);

  useEffect(() => {
    setSeconds(0)
    setMilliseconds(0)
  }, [resetTime])

  // show mili seconds number
  useEffect(() => {
    if (onPlay) {
      const timer = setInterval(() => setMilliseconds(mili => (mili >= 9 ? 0 : mili + 1)), 100)
      return () => clearInterval(timer)
    }
  }, [onPlay])
  // show seconds number
  useEffect(() => {
    if (onPlay) {
      const timer = setInterval(() => setSeconds(time => time + 1), 1000)
      // avoid side effect
      return () => clearInterval(timer)
    }
  }, [onPlay])
  return (
    <div className='flex space-x-6'>
      <span>Time: </span>
      <span>{`${seconds}:${milliSeconds}`}s</span>
    </div>
  )
}
export default memo(Time)