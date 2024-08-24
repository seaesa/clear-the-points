import { useCallback, useEffect, useRef, useState } from 'react'
import Time from './Time'
import BoxInSide from './BoxInSide'

interface Direction {
  horizontal: number,
  vertical: number,
}

export interface BoxProps {
  id: string,
  direction: Direction,
  value: number,
  zIndex: number,
  clicked: boolean,
}

export interface BoxInSideProps extends BoxProps {
  boxs: BoxProps[],
  clicked: boolean,
  choice: boolean,
  setBoxs: React.Dispatch<React.SetStateAction<BoxProps[]>>,
  handleGameOver: () => void
}

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

          <Time onPlay={onPlay} resetTime={resetTime} />
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
