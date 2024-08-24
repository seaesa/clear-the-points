import { memo, useCallback, useEffect, useRef, useState } from 'react'
import Time from './Time'

interface Direction {
  horizontal: number,
  vertical: number,
}

interface BoxProps {
  id: string,
  direction: Direction,
  value: number,
  zIndex: number,
  clicked: boolean,
}

interface BoxInSideProps extends BoxProps {
  boxs: BoxProps[],
  clicked: boolean,
  choice: boolean,
  setBoxs: React.Dispatch<React.SetStateAction<BoxProps[]>>,
  handleGameOver: () => void
}

const BoxInSide: React.FC<BoxInSideProps> = memo(( // wrap memo to avoid re-render unecsessary
  {
    direction: { horizontal, vertical },
    value,
    zIndex,
    setBoxs,
    handleGameOver,
    clicked,
    boxs,
    id,
    choice
  }
) => {
  const [isValid, setIsValid] = useState<boolean>(false)
  const [click, setClick] = useState<boolean>(false)

  // handle when click to the points
  const handleClickBox = useCallback(() => {
    if (!choice) {
      setBoxs(box => (box.map(box => ((box.id === id) ? { ...box, clicked: true } : box))))
    }
  }, [choice])

  // check when click to bigger value to the current value
  useEffect(() => {
    if (clicked) {
      const isBigger = boxs.filter(box => (box.clicked === false)).some(box => (value > box.value))
      setIsValid(!isBigger)
      setClick(true)
    }
  }, [clicked])

  // destroy the points
  useEffect(() => {
    if (isValid) {
      const timeOut = setTimeout(() => {
        setBoxs(box => (box.filter(box => (box.id !== id))))
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
})
function App() {
  const [input, setInput] = useState<string>('')
  const [boxs, setBoxs] = useState<BoxProps[]>([])
  const [onPlay, setOnPlay] = useState<boolean>(false)
  const [choice, setChoice] = useState<boolean>(false)
  const [resetTime, setResetTime] = useState<boolean>(false)
  const [showResult, setShowResult] = useState<'LET\'s PLAY' | 'GAME OVER' | 'ALL CLEARED'>('LET\'s PLAY')

  const blockRef = useRef<HTMLDivElement>(null);

  // block type character to input field
  const handleInputTyping = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    const expression = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'].indexOf(e.key)
    if (expression === -1)
      e.preventDefault()
  }, [])

  // handle play game
  const handlePlayGame = useCallback((e: React.MouseEvent) => {
    if (input) {
      (e.target as HTMLDivElement).innerText = 'Restart';
      setShowResult('LET\'s PLAY')
      setChoice(false)
      setOnPlay(true)
      setResetTime(time => !time)
      setBoxs(() => {
        const divBlock = blockRef.current as HTMLDivElement
        const clientWidth = (divBlock?.clientWidth - 32) // 32 is width of points
        const clientHeight = (divBlock?.clientHeight - 32)
        return [...new Array(Number(input))].map((_undefined, index) => (
          {
            id: crypto.randomUUID(),
            direction: {
              horizontal: Math.round(Math.random() * clientWidth),
              vertical: Math.round(Math.random() * clientHeight),
            },
            clicked: false,
            value: ++index,
            zIndex: Number(input) - index,
          }
        ))
      })
    }
  }, [input])

  // handle when game win
  useEffect(() => {
    const isWinner = (boxs.length <= 0) && (onPlay === true)
    if (isWinner) {
      setShowResult('ALL CLEARED')
      setOnPlay(false)
      setBoxs([])
    }
  }, [boxs])

  // handle when game lose | wrap function in useCallbacl hook to make sure memo HOC can be work
  const handleGameOver = useCallback(() => {
    setShowResult('GAME OVER')
    setOnPlay(false)
    setChoice(true)
  }, [])

  return (
    <div className='justify-center flex flex-col items-center font-bold'>
      <div className='space-y-2 w-[90%] lg:w-[50%] mx-auto'>
        <div className='flex flex-col space-y-2'>
          <h2
            className={`${(showResult === 'ALL CLEARED') ? 'text-green-600' : (showResult === 'GAME OVER') ? 'text-red-600' : ''}`}
          >
            {showResult}
          </h2>
          <div className='flex space-x-6'>
            <span>Points: </span>
            <input
              value={input}
              onKeyDown={handleInputTyping}
              onChange={e => setInput(e.target.value)}
              type="text" className='border border-gray-600 rounded-sm max-w-[200px] px-1' />
          </div>
          <div className='flex space-x-6'>
            <Time onPlay={onPlay} resetTime={resetTime} />
          </div>
        </div>
        <button
          onClick={handlePlayGame}
          className='px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white capitalize rounded-md'>
          Play </button>
        <div
          ref={blockRef}
          className='border border-gray-600 shadow-sm w-full h-[500px] rounded-sm relative overflow-hidden'>
          {boxs.length > 0 && boxs.map(box => (
            <BoxInSide
              key={box.id}
              id={box.id}
              direction={box.direction}
              value={box.value}
              zIndex={box.zIndex}
              setBoxs={setBoxs}
              boxs={boxs}
              clicked={box.clicked}
              choice={choice}
              handleGameOver={handleGameOver}
            />
          )
          )}
        </div>
      </div>
    </div>
  )
}
export default App
