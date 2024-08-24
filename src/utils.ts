import { BoxProps } from './App'

type CallBack = (middleArray: number) => void
export const binarySearch = (box: BoxProps[], value: number, callback: CallBack) => {
  let headArray = 0;
  let endArray = box.length - 1;
  while (headArray <= endArray) {
    let middleArray = Math.floor((headArray + endArray) / 2)
    if (box[middleArray].value === value) {
      callback(middleArray)
      break;
    } else if (box[middleArray].value < value) {
      headArray = middleArray + 1;
    } else {
      endArray = middleArray - 1;
    }
  }
  return [...box]
}