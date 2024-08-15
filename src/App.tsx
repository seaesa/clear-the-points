import { useEffect, useState } from 'react'

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
  block: boolean,
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
    block
  }
) => {
  const [isValid, setIsValid] = useState(false)
  const [click, setClick] = useState(false)
  const handleClickBox = async () => {
    if (!block)
      setBoxs(box => (box.map(box => ((box.id === id) ? { ...box, clicked: true } : box))))
  }
  useEffect(() => {
    if (clicked) {
      const isEqual = box.filter(box => (box.clicked === false)).some(box => (value > box.value))
      setIsValid(!isEqual)
      setClick(true)
    }
  }, [clicked])
  useEffect(() => {
    if (isValid) {
      const timer = setTimeout(() => {
        // setBoxs(box => (box.filter(box => (box.id !== id))))
        setBoxs(box => (box.map(box => ((box.id === id) ? { ...box, hidden: true } : box))))
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isValid])
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
        className={`absolute rounded-full w-8 h-8 border border-gray-600 flex justify-center items-center cursor-pointer ${clicked ? 'bg-red-600 duration-1000' : 'bg-white'}`}>
        <span>{value}</span>
      </div>
    </>
  )
}
function App() {
  const [input, setInput] = useState<string>('')
  const [boxs, setBoxs] = useState<BoxProps[]>([])
  const [time, setTime] = useState(0)
  const [onPlay, setOnPlay] = useState(false)
  const [block, setBlock] = useState(false)
  const [showResult, setShowResult] = useState<'LET\'s PLAY' | 'GAME OVER' | 'ALL CLEARED'>('LET\'s PLAY')
  const handleInputTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }
  const handlePlayGame = (e: React.MouseEvent) => {
    if (input) {
      (e.target as HTMLDivElement).innerText = 'Restart';
      setShowResult('LET\'s PLAY')
      setBlock(false)
      setOnPlay(true)
      setTime(0)
      setBoxs(
        [...new Array(Number(input))].map((_undefined, index) => (
          {
            id: crypto.randomUUID(),
            direction: {
              top: Math.round(Math.random() * 466),
              left: Math.round(Math.random() * 466),
              right: Math.round(Math.random() * 466),
              bottom: Math.round(Math.random() * 466)
            },
            clicked: false,
            value: ++index,
            zIndex: Number(input) - index,
            hidden: false
          }
        ))
      )

    }
  }
  useEffect(() => {
    const isWinner = boxs.length > 0 && boxs.every(box => (box.hidden === true))
    console.log(isWinner)
    if (isWinner) {
      setShowResult('ALL CLEARED')
      setOnPlay(false)
    }
  }, [boxs])

  const handleGameOver = () => {
    setShowResult('GAME OVER')
    setOnPlay(false)
    setBlock(true)
  }
  // useEffect(() => {
  //   if (boxs.length === 0) { 
  //       setOnPlay(false) 
  //   }
  // }, [boxs])
  useEffect(() => {
    if (onPlay) {
      const timeOut = setTimeout(() => setTime(time => time + 1), 1000)
      return () => {
        clearTimeout(timeOut)
      }
    }
  }, [time, onPlay])
  return (
    <>
      <div className='h-screen flex flex-col items-center font-bold'>
        <div className='space-y-2'>
          <div className='flex flex-col space-y-2'>
            <h2
              className={`${showResult === 'ALL CLEARED' ? 'text-green-600' : showResult === 'GAME OVER' ? 'text-red-600' : ''}`}
            >
              {showResult}
            </h2>
            <div className='flex space-x-6'>
              <span>Points: </span>
              <input value={input} onChange={handleInputTyping} type="text" className='border border-gray-600 rounded-sm max-w-[200px] px-1' />
            </div>
            <div className='flex space-x-6'>
              <span>Times: </span>
              <span>{time}s</span>
            </div>
          </div>
          <button
            onClick={handlePlayGame}
            className='px-3 py-1 bg-blue-500 hover:bg-blue-700 text-white capitalize rounded-md'>Play</button>
          <div className='border border-gray-600 shadow-sm w-[500px] h-[500px] rounded-sm relative'>
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
                  block={block}
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
