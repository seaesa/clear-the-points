import { useEffect, useRef, useState } from 'react'

interface Direction {
  top: number,
  bottom: number,
  left: number,
  right: number
}

interface BoxProps {
  id: string,
  direction: Direction,
  value: number,
  zIndex: number,
  clicked: boolean,
  hidden: boolean,
}

interface BoxInSideProps extends BoxProps {
  box: BoxProps[],
  clicked: boolean,
  blocked: boolean,
  setBoxs: React.Dispatch<React.SetStateAction<BoxProps[]>>,
  handleGameOver: () => void
}

const BoxInSide: React.FC<BoxInSideProps> = (
  {
    direction: { top, bottom, left, right },
    value,
    zIndex,
    setBoxs,
    handleGameOver,
    clicked,
    box,
    id,
    blocked
  }
) => {
  const [isValid, setIsValid] = useState(false)
  const [click, setClick] = useState(false)
  // handle when click to the points
  const handleClickBox = async () => {
    if (!blocked)
      setBoxs(box => (box.map(box => ((box.id === id) ? { ...box, clicked: true } : box))))
  }
  // check when click to bigger value to the current value
  useEffect(() => {
    if (clicked) {
      const isBigger = box.filter(box => (box.clicked === false)).some(box => (value > box.value))
      setIsValid(!isBigger)
      setClick(true)
    }
  }, [clicked])
  // destroy the points
  useEffect(() => {
    if (isValid) {
      const timeOut = setTimeout(() => {
        setBoxs(box => (box.map(box => ((box.id === id) ? { ...box, hidden: true } : box))))
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
    <>
      <div
        onClick={handleClickBox}
        style={{
          zIndex,
          inset: `${top}px ${right}px ${bottom}px ${left}px`
        }}
        className={`select-none absolute rounded-full w-8 h-8 border border-gray-600 flex justify-center items-center cursor-pointer ${isValid ? 'bg-red-600 duration-1000' : 'bg-white'}`}>
        <span>{value}</span>
      </div>
    </>
  )
}
function App() {
  const [input, setInput] = useState<string>('')
  const [boxs, setBoxs] = useState<BoxProps[]>([])
  const [time, setTime] = useState(0)
  const [millisecond, setMillisecond] = useState(0)
  const [onPlay, setOnPlay] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [showResult, setShowResult] = useState<'LET\'s PLAY' | 'GAME OVER' | 'ALL CLEARED'>('LET\'s PLAY')

  const blockRef = useRef<HTMLDivElement>(null);

  // block type character to input field
  const handleInputTyping = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const expression = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace'].indexOf(e.key)
    if (expression === -1)
      e.preventDefault()
  }

  // play game
  const handlePlayGame = (e: React.MouseEvent) => {
    if (input) {
      (e.target as HTMLDivElement).innerText = 'Restart';
      setShowResult('LET\'s PLAY')
      setBlocked(false)
      setOnPlay(true)
      setTime(0)
      setMillisecond(0)
      setBoxs(() => {
        const divBlock = blockRef.current as HTMLDivElement
        const offsetWidth = (divBlock?.clientWidth - 32)
        const offsetheight = (divBlock?.clientHeight - 32)
        return [...new Array(Number(input))].map((_undefined, index) => (
          {
            id: crypto.randomUUID(),
            direction: {
              top: Math.round(Math.random() * offsetheight),
              left: Math.round(Math.random() * offsetWidth),
              right: Math.round(Math.random() * offsetWidth),
              bottom: Math.round(Math.random() * offsetheight)
            },
            clicked: false,
            value: ++index,
            zIndex: Number(input) - index,
            hidden: false
          }
        ))
      }
      )

    }
  }
  // handle when game win
  useEffect(() => {
    const isWinner = boxs.length > 0 && boxs.every(box => (box.hidden === true))
    if (isWinner) {
      setShowResult('ALL CLEARED')
      setOnPlay(false)
      setBoxs([])
    }
  }, [boxs])

  // handle when game lose
  const handleGameOver = () => {
    setShowResult('GAME OVER')
    setOnPlay(false)
    setBlocked(true)
  }
  // show seconds number
  useEffect(() => {
    if (onPlay) {
      const timeOut = setTimeout(() => setTime(time => time + 1), 1000)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [time, onPlay])
  // show mili seconds
  useEffect(() => {
    if (onPlay) {
      const timrOut = setTimeout(() => setMillisecond(mili => (mili >= 9 ? 0 : (mili + 1))), 100)
      return () => clearTimeout(timrOut)
    }
  }, [millisecond, onPlay])
  return (
    <>
      <div className='justify-center flex flex-col items-center font-bold'>
        <div className='space-y-2 w-[90%] lg:w-[50%] mx-auto'>
          <div className='flex flex-col space-y-2'>
            <h2
              className={`${showResult === 'ALL CLEARED' ? 'text-green-600' : showResult === 'GAME OVER' ? 'text-red-600' : ''}`}
            >
              {showResult}
            </h2>
            <div className='flex space-x-6'>
              <span>Points: </span>
              <input
                value={input}
                onKeyDown={handleInputTyping}
                onChange={e => setInput(e.target.value)} type="text" className='border border-gray-600 rounded-sm max-w-[200px] px-1' />
            </div>
            <div className='flex space-x-6'>
              <span>Time: </span>
              <span>{`${time}:${millisecond}`}s</span>
            </div>
          </div>
          <button
            onClick={handlePlayGame}
            className='px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white capitalize rounded-md'>Play</button>
          <div
            ref={blockRef}
            className='border border-gray-600 shadow-sm w-full h-[500px] rounded-sm relative overflow-hidden'>
            {boxs.length > 0 && boxs.map(box =>
              !box.hidden && (
                <BoxInSide
                  hidden={box.hidden}
                  id={box.id}
                  direction={box.direction}
                  value={box.value}
                  key={box.id}
                  zIndex={box.zIndex}
                  setBoxs={setBoxs}
                  box={boxs}
                  clicked={box.clicked}
                  blocked={blocked}
                  handleGameOver={handleGameOver}
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default App
