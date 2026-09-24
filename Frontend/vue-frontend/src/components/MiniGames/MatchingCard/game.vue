<!-- Vue 3 Single File Component converted from React version -->
<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

// Ensure multi-word component name for Vue lint rule
defineOptions({ name: 'MatchingCardGame' })

interface Card {
  id: number
  value: string
  suit: string
  color: 'red' | 'black'
  isFlipped: boolean
  isMatched: boolean
}

function createShuffledCards(): Card[] {
  const cardValues = [
    { value: 'A', suit: '♦', color: 'red' as const },
    { value: 'K', suit: '♠', color: 'black' as const },
    { value: 'Q', suit: '♥', color: 'red' as const },
    { value: 'J', suit: '♣', color: 'black' as const },
    { value: '10', suit: '♦', color: 'red' as const },
    { value: '9', suit: '♠', color: 'black' as const },
    { value: '8', suit: '♥', color: 'red' as const },
    { value: '7', suit: '♣', color: 'black' as const },
  ]

  const paired = [...cardValues, ...cardValues]

  for (let i = paired.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[paired[i], paired[j]] = [paired[j], paired[i]]
  }

  return paired.map((card, index) => ({
    id: index,
    ...card,
    isFlipped: false,
    isMatched: false,
  }))
}

const cards = ref<Card[]>(createShuffledCards())
const flipped = ref<number[]>([])
const matched = ref<number[]>([])
const moves = ref(0)
const level = ref(1)
const hearts = ref(15)
const gameOver = ref(false)
const showingPreview = ref(true)

const getPreviewDuration = () => {
  const baseDuration = 3000
  const decrement = (level.value - 1) * 200
  return Math.max(800, baseDuration - decrement)
}

let previewTimer: number | undefined

onMounted(() => {
  // start initial preview timer
  previewTimer = window.setTimeout(() => {
    showingPreview.value = false
  }, getPreviewDuration())
})

watch([() => showingPreview.value, () => level.value], ([preview]) => {
  if (preview) {
    if (previewTimer) window.clearTimeout(previewTimer)
    previewTimer = window.setTimeout(() => {
      showingPreview.value = false
    }, getPreviewDuration())
  }
})

watch(flipped, (curr) => {
  if (curr.length === 2) {
    moves.value += 1

    const [first, second] = curr
    const firstCard = cards.value[first]
    const secondCard = cards.value[second]

    if (
      firstCard.value === secondCard.value &&
      firstCard.suit === secondCard.suit
    ) {
      matched.value = [...matched.value, first, second]
      flipped.value = []
    } else {
      const newHearts = Math.max(0, hearts.value - 1)
      hearts.value = newHearts

      if (newHearts <= 0) {
        gameOver.value = true
      }

      window.setTimeout(() => {
        flipped.value = []
      }, 600)
    }
  }
})

function handleCardClick(id: number) {
  if (
    !showingPreview.value &&
    !matched.value.includes(id) &&
    !flipped.value.includes(id) &&
    flipped.value.length < 2 &&
    !gameOver.value
  ) {
    flipped.value = [...flipped.value, id]
  }
}

function nextLevel() {
  const newLevel = level.value + 1
  const newHearts = Math.max(5, 15 - (newLevel - 1) * 2) // Hearts decrease by 2 per level, minimum 5

  level.value = newLevel
  hearts.value = newHearts
  cards.value = createShuffledCards()
  flipped.value = []
  matched.value = []
  moves.value = 0
  gameOver.value = false
  showingPreview.value = true

  if (previewTimer) window.clearTimeout(previewTimer)
  previewTimer = window.setTimeout(() => {
    showingPreview.value = false
  }, getPreviewDuration())
}

function resetGame() {
  level.value = 1
  hearts.value = 15
  cards.value = createShuffledCards()
  flipped.value = []
  matched.value = []
  moves.value = 0
  gameOver.value = false
  showingPreview.value = true

  if (previewTimer) window.clearTimeout(previewTimer)
  previewTimer = window.setTimeout(() => {
    showingPreview.value = false
  }, getPreviewDuration())
}

const isGameWon = computed(() => matched.value.length === 16)
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-[#7a9d6e] to-[#5d7d5a] p-8 flex flex-col items-center justify-center">
    <div class="w-full max-w-2xl">
      <div class="mb-8 text-center">
        <h1 class="text-4xl font-bold text-white mb-2">Memory Game</h1>

        <div class="flex justify-between items-center bg-white/10 rounded-lg p-4 backdrop-blur-sm mb-4">
          <div class="text-white">
            <p class="text-sm opacity-75">Level</p>
            <p class="text-2xl font-bold">{{ level }}</p>
          </div>
          <div class="text-white">
            <p class="text-sm opacity-75">Hearts</p>
            <p class="text-2xl font-bold text-red-300">{{ '❤️ '.repeat(hearts) }}</p>
          </div>
          <div class="text-white">
            <p class="text-sm opacity-75">Matched</p>
            <p class="text-2xl font-bold">{{ matched.length / 2 }}/8</p>
          </div>
          <button
            @click="resetGame"
            class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors font-semibold"
          >
            Reset
          </button>
        </div>

        <div v-if="showingPreview" class="text-white text-lg font-semibold mb-4">
          Memorize the cards... {{ Math.ceil(getPreviewDuration() / 1000) }}s
        </div>
      </div>

      <!-- Game grid -->
      <div class="grid grid-cols-4 gap-4 mb-8">
        <button
          v-for="(card, index) in cards"
          :key="card.id"
          @click="handleCardClick(index)"
          :disabled="matched.includes(index) || showingPreview"
          class="aspect-square perspective focus:outline-none disabled:opacity-50"
        >
          <div
            class="relative w-full h-full transition-transform duration-300 cursor-pointer hover:scale-105 active:scale-95 disabled:hover:scale-100 disabled:cursor-default"
            :style="{
              transformStyle: 'preserve-3d',
              transform: (flipped.includes(index) || matched.includes(index) || showingPreview) ? 'rotateY(0deg)' : 'rotateY(180deg)'
            }"
          >
            <!-- Card back -->
            <div
              class="absolute w-full h-full bg-gradient-to-br from-[#a8d5e7] to-[#7eb3d4] rounded-lg shadow-lg border-2 border-[#6ba3c4] flex items-center justify-center"
              :style="{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }"
            >
              <div class="text-white/40 text-2xl">♠</div>
            </div>

            <!-- Card front -->
            <div
              class="absolute w-full h-full bg-white rounded-lg shadow-lg flex flex-col items-center justify-center border-2 border-gray-100"
              :style="{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }"
            >
              <div
                class="absolute top-2 left-3 text-xl font-bold"
                :class="card.color === 'red' ? 'text-red-500' : 'text-black'"
              >
                <div>{{ card.value }}</div>
                <div class="text-lg">{{ card.suit }}</div>
              </div>

              <div
                class="text-5xl font-bold"
                :class="card.color === 'red' ? 'text-red-500' : 'text-black'"
              >
                {{ card.suit }}
              </div>

              <div
                class="absolute bottom-2 right-3 text-xl font-bold rotate-180"
                :class="card.color === 'red' ? 'text-red-500' : 'text-black'"
              >
                <div>{{ card.value }}</div>
                <div class="text-lg">{{ card.suit }}</div>
              </div>
            </div>
          </div>
        </button>
      </div>

      <div v-if="gameOver" class="text-center">
        <div class="bg-red-400/20 border-2 border-red-400 rounded-lg p-6 backdrop-blur-sm">
          <h2 class="text-3xl font-bold text-red-300 mb-2">Game Over!</h2>
          <p class="text-white mb-4">You ran out of hearts on Level {{ level }}</p>
          <button
            @click="resetGame"
            class="px-6 py-2 bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <div v-if="isGameWon && !gameOver" class="text-center">
        <div class="bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-6 backdrop-blur-sm">
          <h2 class="text-3xl font-bold text-yellow-300 mb-2">Level {{ level }} Complete! 🎉</h2>
          <p class="text-white mb-4">
            Completed in {{ moves }} moves with {{ hearts }} hearts remaining
          </p>
          <button
            @click="nextLevel"
            class="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-lg font-semibold transition-colors"
          >
            Next Level
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.perspective {
  perspective: 1000px;
}
</style>
