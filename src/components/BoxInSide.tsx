import { memo, useRef, useState } from 'react'
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
  const [hidden, setHidden] = useState<boolean>(false)

  const boxRef = useRef<HTMLDivElement>(null)

  // handle when click to the points
  const handleClickBox = () => {
    if (initial.previousValue !== value) {
      if (value - 1 !== initial.previousValue) {
        initial.previousValue = 0;
        handleGameOver()
      }
      else {
        initial.previousValue = value;
        destroyThePoint()
      }
    }
  }

  const destroyThePoint = () => {
    boxRef.current?.classList.add('!bg-red-600', 'duration-1000', 'pointer-events-none');
    setTimeout(() => {
      setHidden(true)
    }, 2000)
  }

  return (
    !hidden &&
    <div
      ref={boxRef}
      onClick={handleClickBox}
      style={{
        zIndex,
        inset: `${vertical}px ${horizontal}px`
      }}
      className='bg-white select-none absolute rounded-full w-8 h-8 border border-gray-600 flex justify-center items-center cursor-pointer'>
      <span>{value}</span>
    </div>
  )
}
export default memo(BoxInSide)
