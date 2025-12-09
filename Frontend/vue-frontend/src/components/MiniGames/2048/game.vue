<template>
  <div class="w-full">
      <div class="p-4 mx-auto max-w-md select-none">
        <div class="flex justify-between items-end mb-4">
          <h1 class="text-3xl font-bold">2048</h1>
          <div class="text-right">
            <div class="flex gap-2">
              <div class="bg-gray-800 text-white rounded px-3 py-1 min-w-20">
                <div class="text-xs uppercase">Score</div>
                <div class="text-lg font-bold">{{ score }}</div>
              </div>
              <div class="bg-gray-700 text-white rounded px-3 py-1 min-w-20">
                <div class="text-xs uppercase">Best</div>
                <div class="text-lg font-bold">{{ best }}</div>
              </div>
            </div>
            <div class="mt-2 flex gap-2 justify-end">
              <button class="bg-accent text-white rounded px-3 py-1 font-semibold hover:opacity-90" @click="newGame">New Game</button>
            </div>
          </div>
        </div>
    
        <div
          id="game-2048-board"
          ref="boardEl"
          class="relative outline-none"
          tabindex="0"
          @keydown.prevent="onKey"
          @touchstart.passive="onTouchStart"
          @touchend.passive="onTouchEnd"
        >
          <div
            class="grid grid-cols-4 gap-2 bg-[#bbaaaa] p-2 rounded-lg"
            :class="moveDir ? `board-move-${moveDir}` : ''"
          >
            <template v-for="(row, r) in grid" :key="r">
              <div
                v-for="(cell, c) in row"
                :key="`${r}-${c}`"
                class="h-20 md:h-24 rounded-md flex items-center justify-center font-extrabold text-2xl md:text-3xl transition-all duration-100 text-black"
                :class="tileClass(cell)"
              >
                {{ cell || '' }}
              </div>
            </template>
          </div>
    
          <div v-if="won || over" class="absolute inset-0 bg-white/70 backdrop-blur-sm rounded-lg flex flex-col items-center justify-center gap-3">
            <div class="text-2xl font-bold" v-if="won">You win!</div>
            <div class="text-2xl font-bold" v-else>Game over</div>
            <div class="flex gap-2">
              <button v-if="won && !keepPlayingMode" @click="keepPlaying" class="bg-gray-800 text-white rounded px-3 py-1 font-semibold hover:opacity-90">Keep going</button>
              <button @click="newGame" class="bg-accent text-white rounded px-3 py-1 font-semibold hover:opacity-90">Try again</button>
            </div>
          </div>
        </div>
    
        <p class="mt-3 text-sm text-muted-foreground">Use arrow keys or swipe to move tiles.</p>
      </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'

defineOptions({ name: 'MiniGames2048Game' })

const size = 4
const grid = ref<number[][]>([])
const score = ref(0)
const best = ref<number>(Number(localStorage.getItem('2048_best') || '0'))
const won = ref(false)
const over = ref(false)
const keepPlayingMode = ref(false)

const startX = ref(0)
const startY = ref(0)
const boardEl = ref<HTMLElement | null>(null)

const moveDir = ref<null | 'left' | 'right' | 'up' | 'down'>(null)

function emptyGrid(): number[][] {
  return Array.from({ length: size }, () => Array<number>(size).fill(0))
}

function newGame() {
  grid.value = emptyGrid()
  score.value = 0
  won.value = false
  over.value = false
  keepPlayingMode.value = false
  addRandomTile()
  addRandomTile()
  saveState()
  nextTick(() => boardEl.value?.focus())
}

function addRandomTile() {
  const empties: Array<[number, number]> = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid.value[r][c] === 0) empties.push([r, c])
    }
  }
  if (empties.length === 0) return
  const [r, c] = empties[Math.floor(Math.random() * empties.length)]
  grid.value[r][c] = Math.random() < 0.9 ? 2 : 4
}

function canMove(): boolean {
  // empty cell
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const v = grid.value[r][c]
      if (v === 0) return true
      if (r + 1 < size && grid.value[r + 1][c] === v) return true
      if (c + 1 < size && grid.value[r][c + 1] === v) return true
    }
  }
  return false
}

type Dir = 'left' | 'right' | 'up' | 'down'
function move(dir: Dir) {
  if ((won.value && !keepPlayingMode.value) || over.value) return
  const before = JSON.stringify(grid.value)
  let moved = false
  const mergeScoreRef = { add: 0 }

  if (dir === 'left') {
    for (let r = 0; r < size; r++) moved = compressMergeRow(grid.value[r], mergeScoreRef) || moved
  } else if (dir === 'right') {
    for (let r = 0; r < size; r++) {
      const row = [...grid.value[r]].reverse()
      const did = compressMergeRow(row, mergeScoreRef)
      grid.value[r] = row.reverse()
      moved = did || moved
    }
  } else if (dir === 'up') {
    for (let c = 0; c < size; c++) {
      const col = Array.from({ length: size }, (_, r) => grid.value[r][c])
      const did = compressMergeRow(col, mergeScoreRef)
      for (let r = 0; r < size; r++) grid.value[r][c] = col[r]
      moved = did || moved
    }
  } else if (dir === 'down') {
    for (let c = 0; c < size; c++) {
      const col = Array.from({ length: size }, (_, r) => grid.value[r][c]).reverse()
      const did = compressMergeRow(col, mergeScoreRef)
      const res = col.reverse()
      for (let r = 0; r < size; r++) grid.value[r][c] = res[r]
      moved = did || moved
    }
  }

  if (JSON.stringify(grid.value) !== before) moved = true

  if (moved) {
    moveDir.value = dir

    score.value += mergeScoreRef.add
    addRandomTile()
    if (!keepPlayingMode.value && has2048()) won.value = true
    if (!canMove()) over.value = true
    saveState()

    setTimeout(() => { moveDir.value = null }, 180)
  }
}

function compressMergeRow(arr: number[], mergeScoreRef: { add: number }): boolean {
  const old = arr.slice()
  const filtered = arr.filter((v) => v !== 0)
  const res: number[] = []
  for (let i = 0; i < filtered.length; i++) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const merged = filtered[i] * 2
      res.push(merged)
      mergeScoreRef.add += merged
      i++
    } else {
      res.push(filtered[i])
    }
  }
  while (res.length < size) res.push(0)
  for (let i = 0; i < size; i++) arr[i] = res[i]
  return JSON.stringify(old) !== JSON.stringify(arr)
}

function has2048() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) if (grid.value[r][c] === 2048) return true
  }
  return false
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move('left')
  else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') move('right')
  else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') move('up')
  else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') move('down')
}

function onTouchStart(e: TouchEvent) {
  const t = e.changedTouches[0]
  startX.value = t.clientX
  startY.value = t.clientY
}

function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0]
  const dx = t.clientX - startX.value
  const dy = t.clientY - startY.value
  const absX = Math.abs(dx)
  const absY = Math.abs(dy)
  if (Math.max(absX, absY) < 20) return
  if (absX > absY) move(dx > 0 ? 'right' : 'left')
  else move(dy > 0 ? 'down' : 'up')
}

function tileClass(v: number) {
  const base = 'bg-[#ddccbb] text-[#776e65]'
  if (v === 0) return base
  const colors: Record<number, string> = {
    2: 'bg-[#eee4da] text-[#776666]',
    4: 'bg-[#ede0c8] text-[#776666]',
    8: 'bg-[#f2b179] text-white',
    16: 'bg-[#f59563] text-white',
    32: 'bg-[#f67c5f] text-white',
    64: 'bg-[#f65e3b] text-white',
    128: 'bg-[#edcf72] text-white text-2xl md:text-3xl',
    256: 'bg-[#edcc61] text-white text-2xl md:text-3xl',
    512: 'bg-[#edc850] text-white text-2xl md:text-3xl',
    1024: 'bg-[#edc53f] text-white text-xl md:text-2xl',
    2048: 'bg-[#edc22e] text-white text-xl md:text-2xl'
  }
  return colors[v] || 'bg-black text-white text-xl md:text-2xl'
}

function keepPlaying() {
  keepPlayingMode.value = true
  won.value = false
}

function saveState() {
  const newBest = Math.max(best.value, score.value)
  best.value = newBest
  localStorage.setItem('2048_best', String(newBest))
  localStorage.setItem('2048_state', JSON.stringify({ grid: grid.value, score: score.value }))
}

function loadState() {
  const st = localStorage.getItem('2048_state')
  if (st) {
    try {
      const parsed = JSON.parse(st)
      if (Array.isArray(parsed.grid) && parsed.grid.length === size) {
        grid.value = parsed.grid
        score.value = Number(parsed.score || 0)
        over.value = !canMove()
        won.value = has2048()
        nextTick(() => boardEl.value?.focus())
        return
      }
    } catch {
      // ignore and start fresh
    }
  }
  newGame()
}

onMounted(() => {
  loadState()
})
</script>

<style scoped>
/* Tailwind handles most styling */
@keyframes board-left { 0% { transform: translateX(0); } 50% { transform: translateX(-6px); } 100% { transform: translateX(0); } }
@keyframes board-right { 0% { transform: translateX(0); } 50% { transform: translateX(6px); } 100% { transform: translateX(0); } }
@keyframes board-up { 0% { transform: translateY(0); } 50% { transform: translateY(-6px); } 100% { transform: translateY(0); } }
@keyframes board-down { 0% { transform: translateY(0); } 50% { transform: translateY(6px); } 100% { transform: translateY(0); } }
.board-move-left { animation: board-left 160ms ease-out; }
.board-move-right { animation: board-right 160ms ease-out; }
.board-move-up { animation: board-up 160ms ease-out; }
.board-move-down { animation: board-down 160ms ease-out; }
</style>
