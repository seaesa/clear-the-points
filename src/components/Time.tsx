import { memo, useEffect, useMemo, useState } from 'react';

function Time({ onPlay, resetTime }: { onPlay: boolean, resetTime: boolean }) {
  const [startTime, setStartTime] = useState(0);
  const [timeNow, setTimeNow] = useState(0);

  const seconds = useMemo(() => (timeNow - startTime) / 1000, [timeNow])

  useEffect(() => {
    if (onPlay) {
      setStartTime(Date.now())
      setTimeNow(Date.now())
      const timer = setInterval(() => {
        setTimeNow(Date.now())
      }, 100)
      return () => clearInterval(timer)
    }
  }, [onPlay, resetTime])

  return (
    <div className='flex space-x-6'>
      <span>Time: </span>
      <span>{seconds.toFixed(1)}s</span>
    </div>
  )
}
export default memo(Time)