<template>
  <div class="flex flex-col items-center justify-center gap-4" @touchstart="onTouchStart" @touchend="onTouchEnd">
    <!-- Header -->
    <div class="w-full flex items-center justify-between px-4 py-3 bg-emerald-700 rounded-lg max-w-sm">
      <div class="flex items-center gap-2">
        <span class="text-2xl">🍎</span>
        <span class="text-white text-lg font-bold">{{ score }}</span>
      </div>
      <button @click="soundEnabled = !soundEnabled" class="text-white cursor-pointer text-xl">
        {{ soundEnabled ? "🔊" : "🔇" }}
      </button>
    </div>

    <!-- Game Board - No checkerboard pattern -->
    <div
      class="bg-lime-300 rounded-lg shadow-lg"
      :style="{
        width: GRID_SIZE * cellSize + 'px',
        height: GRID_SIZE * cellSize + 'px',
        position: 'relative',
        touchAction: 'none'
      }"
    >
      <!-- Snake -->
      <div
        v-for="(segment, index) in snake"
        :key="index"
        :class="index === 0 ? 'bg-blue-600 rounded-sm' : 'bg-blue-500 rounded-sm'"
        :style="{
          position: 'absolute',
          width: cellSize + 'px',
          height: cellSize + 'px',
          transform: `translate(${segment[0] * cellSize}px, ${segment[1] * cellSize}px)`,
          transition: `transform ${currentSpeed}ms linear`,
          willChange: 'transform'
        }"
      />

      <!-- Food -->
      <div
        class="bg-red-500 rounded-full flex items-center justify-center"
        :style="{
          position: 'absolute',
          left: food[0] * cellSize + 'px',
          top: food[1] * cellSize + 'px',
          width: cellSize + 'px',
          height: cellSize + 'px'
        }"
      />

      <!-- Game Over Screen -->
      <div v-if="gameOver" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex flex-col items-center justify-center gap-4">
        <div class="text-white text-xl font-bold">Game Over!</div>
        <div class="text-white text-lg">Final Score: {{ score }}</div>
        <button @click="handleReset" class="px-6 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition">
          Play Again
        </button>
      </div>

      <!-- Paused Screen -->
      <div v-if="isPaused && !gameOver" class="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
        <div class="text-white text-2xl font-bold">Paused</div>
      </div>
    </div>

    <!-- <div v-if="isMobile" class="flex flex-col items-center gap-2 max-w-sm">
      <button
        @click="handleDirectionButton([0, -1])"
        class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
      >
        ↑ Up
      </button>
      <div class="flex gap-2">
        <button
          @click="handleDirectionButton([-1, 0])"
          class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        >
          ← Left
        </button>
        <button
          @click="handleDirectionButton([0, 1])"
          class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        >
          ↓ Down
        </button>
        <button
          @click="handleDirectionButton([1, 0])"
          class="px-6 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 active:bg-blue-700 transition"
        >
          Right →
        </button>
      </div>
    </div> -->

    <!-- Controls Info -->
    <div class="text-center text-gray-400 text-xs md:text-sm max-w-sm">
      <template v-if="!isMobile">
        <p class="mb-2">
          <span class="font-bold">Arrow Keys</span> or <span class="font-bold">WASD</span> to move
        </p>
        <p>
          <span class="font-bold">Space</span> to pause
        </p>
      </template>
      <p v-else class="text-gray-400">Use buttons or swipe to move!</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

defineOptions({ name: 'SnakeGame' })

const GRID_SIZE = 20
const INITIAL_SPEED = 100
const currentSpeed = ref(INITIAL_SPEED)

const snake = ref<number[][]>([[10, 10]])
const food = ref<number[]>([15, 15])
const direction = ref<number[]>([1, 0])
const nextDirection = ref<number[]>([1, 0])
const gameOver = ref(false)
const score = ref(0)
const isPaused = ref(false)
const soundEnabled = ref(true)
const isMobile = ref(false)
const gameStarted = ref(false)

let intervalId: number | undefined

// Touch handling
const touchStartX = ref(0)
const touchStartY = ref(0)
const SWIPE_THRESHOLD = 24 // pixels

onMounted(() => {
  isMobile.value = window.innerWidth <= 768
  // Auto-start so the snake moves immediately
  gameStarted.value = true

  const handleKeyPress = (e: KeyboardEvent) => {
    gameStarted.value = true

    const key = e.key.toUpperCase()
    switch (key) {
      case 'ARROWUP':
      case 'W':
        e.preventDefault()
        if (direction.value[1] === 0) nextDirection.value = [0, -1]
        break
      case 'ARROWDOWN':
      case 'S':
        e.preventDefault()
        if (direction.value[1] === 0) nextDirection.value = [0, 1]
        break
      case 'ARROWLEFT':
      case 'A':
        e.preventDefault()
        if (direction.value[0] === 0) nextDirection.value = [-1, 0]
        break
      case 'ARROWRIGHT':
      case 'D':
        e.preventDefault()
        if (direction.value[0] === 0) nextDirection.value = [1, 0]
        break
      case ' ':
        e.preventDefault()
        isPaused.value = !isPaused.value
        break
    }
  }

  window.addEventListener('keydown', handleKeyPress)

  const tick = () => {
    if (gameOver.value || isPaused.value || !gameStarted.value) return

    const newSnake = [...snake.value]
    const head = [...newSnake[0]]

    head[0] += nextDirection.value[0]
    head[1] += nextDirection.value[1]

    // Wall collision
    if (head[0] < 0 || head[0] >= GRID_SIZE || head[1] < 0 || head[1] >= GRID_SIZE) {
      gameOver.value = true
      return
    }

    // Self collision
    if (newSnake.some((segment) => segment[0] === head[0] && segment[1] === head[1])) {
      gameOver.value = true
      return
    }

    newSnake.unshift(head)

    // Food collision
    if (head[0] === food.value[0] && head[1] === food.value[1]) {
      score.value += 1
      playSound()
      food.value = generateFood(newSnake)
    } else {
      newSnake.pop()
    }

    direction.value = [...nextDirection.value]
    snake.value = newSnake
  }

  const startLoop = () => {
    stopLoop()
    const speed = Math.max(50, INITIAL_SPEED - score.value * 2)
    currentSpeed.value = speed
    intervalId = window.setInterval(tick, speed)
  }

  const stopLoop = () => {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
      intervalId = undefined
    }
  }

  // Start loop initially
  startLoop()

  // Restart loop when speed-affecting or running state changes
  watch([score, isPaused, gameOver, gameStarted], () => {
    startLoop()
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyPress)
    stopLoop()
  })
})

function generateFood(currentSnake: number[][]): number[] {
  let newFood: number[] = [0, 0]
  let validPosition = false
  while (!validPosition) {
    newFood = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)]
    validPosition = !currentSnake.some((segment) => segment[0] === newFood[0] && segment[1] === newFood[1])
  }
  return newFood
}

// Typed Window augmentation for webkitAudioContext
interface WindowWithWebkit extends Window {
  webkitAudioContext?: typeof AudioContext
}

function playSound() {
  if (soundEnabled.value) {
    const W = window as WindowWithWebkit
    const AudioCtxCtor: typeof AudioContext | undefined = window.AudioContext ?? W.webkitAudioContext
    if (!AudioCtxCtor) return
    const audioContext = new AudioCtxCtor()
    const oscillator = audioContext.createOscillator()
    const gain = audioContext.createGain()

    oscillator.connect(gain)
    gain.connect(audioContext.destination)

    oscillator.frequency.value = 400
    oscillator.type = 'sine'
    gain.gain.setValueAtTime(0.1, audioContext.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1)

    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.1)
  }
}

function handleReset() {
  snake.value = [[10, 10]]
  food.value = generateFood([[10, 10]])
  direction.value = [1, 0]
  nextDirection.value = [1, 0]
  gameOver.value = false
  score.value = 0
  isPaused.value = false
  gameStarted.value = true
}

const cellSize = window.innerWidth <= 768 ? 17 : 20

function onTouchStart(e: TouchEvent) {
  gameStarted.value = true
  const touch = e.touches[0]
  touchStartX.value = touch.clientX
  touchStartY.value = touch.clientY
}

function onTouchEnd(e: TouchEvent) {
  gameStarted.value = true
  const touch = e.changedTouches[0]
  const dx = touch.clientX - touchStartX.value
  const dy = touch.clientY - touchStartY.value

  if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return

  if (Math.abs(dx) > Math.abs(dy)) {
    // Horizontal swipe
    if (dx > 0 && direction.value[0] === 0) nextDirection.value = [1, 0]
    if (dx < 0 && direction.value[0] === 0) nextDirection.value = [-1, 0]
  } else {
    // Vertical swipe
    if (dy > 0 && direction.value[1] === 0) nextDirection.value = [0, 1]
    if (dy < 0 && direction.value[1] === 0) nextDirection.value = [0, -1]
  }
}
</script>

<style scoped>
/* No additional styles required; using utility classes */
</style>
