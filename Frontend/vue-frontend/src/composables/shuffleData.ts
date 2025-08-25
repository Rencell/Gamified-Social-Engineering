export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length,
    randomIndex
  const arr = [...array]
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--
    ;[arr[currentIndex], arr[randomIndex]] = [arr[randomIndex], arr[currentIndex]]
  }
  return arr
}
