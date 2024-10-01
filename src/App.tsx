import { useEffect, useRef, useState } from 'react'
import Time from './components/Time'
import BoxInSide, { initial } from './components/BoxInSide'

interface Direction {
  horizontal: number,
  vertical: number,
}

export interface BoxProps {
  id: string,
  direction: Direction,
  value: number,
  zIndex: number,
}

export interface BoxInSideProps extends Omit<BoxProps, 'id'> {
  handleGameOver: () => void
}

function App() {
  const [boxs, setBoxs] = useState<BoxProps[]>([])
  const [play, setOnPlay] = useState<{ isPlay: boolean }>({ isPlay: false })
  const [showResult, setShowResult] = useState<'LET\'s PLAY' | 'GAME OVER' | 'ALL CLEARED'>('LET\'s PLAY')

  const blockRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // block type character to input field
  const handleInputTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const expression = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'].indexOf(e.key)
    if (expression === -1)
      e.preventDefault()
  }

  // handle play game
  const handlePlayGame = (e: React.MouseEvent) => {
    const value = inputRef.current?.value;
    if (value) {
      initial.previousValue = 0;
      blockRef.current?.classList.add('pointer-events-auto');
      (e.target as HTMLDivElement).innerText = 'Restart';
      setShowResult('LET\'s PLAY')
      setOnPlay({ isPlay: true })
      setBoxs(() => {
        const divBlock = blockRef.current as HTMLDivElement
        const clientWidth = (divBlock?.clientWidth - 32) // 32 is width of points
        const clientHeight = (divBlock?.clientHeight - 32)
        return [...new Array(Number(value))].map((_, index) => (
          {
            id: crypto.randomUUID(),
            direction: {
              horizontal: Math.round(Math.random() * clientWidth),
              vertical: Math.round(Math.random() * clientHeight),
            },
            value: ++index,
            zIndex: Number(value) - index,
          }
        ))
      })
    }
  }

  // handle when game lose 
  const handleGameOver = () => {
    setShowResult('GAME OVER')
    setOnPlay({ isPlay: false })
    blockRef.current?.classList.add('pointer-events-none')
  }

  const handleWinGame = () => {
    initial.previousValue = 0;
    setBoxs([])
    setShowResult('ALL CLEARED')
    setOnPlay({ isPlay: false })
  }

  useEffect(() => {
    if (play.isPlay) {
      const element = blockRef.current!
      const observer = new MutationObserver(() => {
        if (!element.childElementCount)
          handleWinGame()
      });
      observer.observe(element, {
        childList: true,
        subtree: true
      });
      return () => observer.disconnect();
    }
  }, [play])

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
              ref={inputRef}
              onKeyDown={handleInputTyping}
              type="text" className='border border-gray-600 rounded-sm max-w-[200px] px-1' />
          </div>

          <Time play={play} />
        </div>
        <button
          onClick={handlePlayGame}
          className='px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white capitalize rounded-md'>
          Play
        </button>
        <div
          ref={blockRef}
          className='border border-gray-600 shadow-sm w-full h-[500px] rounded-sm relative overflow-hidden'>
          <>
            {boxs.length > 0 && boxs.map((box) => (
              <BoxInSide
                key={box.id}
                direction={box.direction}
                value={box.value}
                zIndex={box.zIndex}
                handleGameOver={handleGameOver}
              />
            )
            )}
          </>
        </div>
      </div>
    </div>
  )
}
export default App
