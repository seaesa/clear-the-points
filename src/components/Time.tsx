import { useEffect, useState } from 'react';

function Time({ play }: { play: { isPlay: boolean } }) {
  const [startTime, setStartTime] = useState(0);
  const [timeNow, setTimeNow] = useState(0);

  const seconds = (timeNow - startTime) / 1000

  useEffect(() => {
    if (play.isPlay) {
      setStartTime(Date.now())
      setTimeNow(Date.now())
      const timer = setInterval(() => {
        setTimeNow(Date.now())
      }, 100)
      return () => clearInterval(timer)
    }
  }, [play])

  return (
    <div className='flex space-x-6'>
      <span>Time: </span>
      <span>{seconds.toFixed(1)}s</span>
    </div>
  )
}
export default Time