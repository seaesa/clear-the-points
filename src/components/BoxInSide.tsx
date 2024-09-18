import { memo, useCallback, useEffect, useState } from 'react'
import { binarySearch } from '../lib/utils'
import { BoxInSideProps } from '../App'

const BoxInSide: React.FC<Omit<BoxInSideProps, 'id'>> = ( // wrap memo to avoid re-render unecsessary
  {
    direction: { horizontal, vertical },
    value,
    zIndex,
    setBoxs,
    handleGameOver,
    clicked,
    boxs,
    choice
  }
) => {
  const [isValid, setIsValid] = useState<boolean>(false)
  const [click, setClick] = useState<boolean>(false)

  // handle when click to the points
  const handleClickBox = useCallback(() => {
    if (!choice) {
      // apply searching binary algorithms
      setBoxs(box => binarySearch(box, value, ((number) => {
        box[number].clicked = true
      })))
    }
  }, [choice])
  // check when click to bigger value to the current value
  useEffect(() => {
    if (clicked) {
      const isBigger = boxs.slice(0, value).some(box => (box.clicked === false && value > box.value))
      setIsValid(!isBigger)
      setClick(true)
    }
  }, [clicked])

  // destroy the points
  useEffect(() => {
    if (isValid) {
      const timeOut = setTimeout(() => {
        setBoxs(box => binarySearch(box, value, ((number) => {
          box.splice(number, 1)
        })))
      }, 2000)
      return () => clearTimeout(timeOut)
    }
  }, [isValid])

  // handle lose game when click to bigger value to the current value
  useEffect(() => {
    if (!isValid && click) {
      handleGameOver()
    }
  }, [click])

  return (
    <div
      onClick={handleClickBox}
      style={{
        zIndex,
        inset: `${vertical}px ${horizontal}px`
      }}
      className={`select-none absolute rounded-full w-8 h-8 border border-gray-600 flex justify-center items-center cursor-pointer ${isValid ? 'bg-red-600 duration-1000' : 'bg-white'}`}>
      <span>{value}</span>
    </div>
  )
}
export default memo(BoxInSide)
