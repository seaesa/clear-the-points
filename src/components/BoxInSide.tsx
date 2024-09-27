import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { BoxInSideProps } from '../App'


export const initial = {
  previousValue: 0
}
const BoxInSide: React.FC<BoxInSideProps> = (
  {
    direction: { horizontal, vertical },
    value,
    zIndex,
    handleGameOver,
  }
) => {
  const [click, setClick] = useState<boolean>(false)
  const [hidden, setHidden] = useState<boolean>(false)
  const boxRef = useRef<HTMLDivElement>(null)
  // handle when click to the points
  const handleClickBox = useCallback(() => {
    if (click === false && initial.previousValue !== value) {
      if (value - 1 !== initial.previousValue) {
        initial.previousValue = 0;
        handleGameOver()
        return;
      }
      else initial.previousValue = value;
      setClick(true)
    }
  }, [])

  // destroy the points
  useEffect(() => {
    if (click) {
      const timer = setTimeout(() => {
        setHidden(true)
        boxRef.current?.setAttribute('aria-checked', 'true');
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [click])

  return (
    !hidden &&
    <div
      ref={boxRef}
      onClick={handleClickBox}
      style={{
        zIndex,
        inset: `${vertical}px ${horizontal}px`
      }}
      className={`${click ? 'bg-red-600 duration-1000' : 'bg-white'} select-none absolute rounded-full w-8 h-8 border border-gray-600 flex justify-center items-center cursor-pointer`}>
      <span>{value}</span>
    </div>
  )
}
export default memo(BoxInSide)
