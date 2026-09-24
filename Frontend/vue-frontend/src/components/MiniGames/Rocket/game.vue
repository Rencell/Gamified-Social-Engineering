<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, Pause, Play } from 'lucide-vue-next';
import ProgressBar from './common/ProgressBar.vue';
import Rocket from './rocket.vue'

interface Question {
  word: string;
  correctAnswer: string;
  wrongAnswer: string;
}

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  speed: number;
}

const questions: Question[] = [
  { word: 'Password123', correctAnswer: 'P@ssw0rd!2023', wrongAnswer: 'Password123' },
  { word: 'qwerty', correctAnswer: 'Qw3rty$Secure', wrongAnswer: 'qwerty' },
  { word: '123456', correctAnswer: '1Strong!Pass456', wrongAnswer: '123456' },
  { word: 'letmein', correctAnswer: 'L3tM3!n2023', wrongAnswer: 'letmein' },
  { word: 'abc123', correctAnswer: 'Abc!123$Secure', wrongAnswer: 'abc123' },
  { word: 'iloveyou', correctAnswer: 'IL0v3Y0u!2023', wrongAnswer: 'iloveyou' },
  { word: 'admin', correctAnswer: 'Adm!n$Secure2023', wrongAnswer: 'admin' },
  { word: 'welcome', correctAnswer: 'W3lc0m3!Secure', wrongAnswer: 'welcome' },
  { word: 'monkey', correctAnswer: 'M0nk3y!Secure', wrongAnswer: 'monkey' },
  { word: 'football', correctAnswer: 'F00tB@ll!2023', wrongAnswer: 'football' },
];

const currentQuestion = ref(0);
const score = ref(0);
const lives = ref(3);
const gameState = ref<'menu' | 'playing' | 'paused' | 'gameOver' | 'victory'>('menu');
const showFeedback = ref<'correct' | 'wrong' | null>(null);
const rocketHeight = ref(35); // Rocket height as percentage
const stars = ref<Star[]>([]);
const lastAnswerTime = ref(Date.now());
const shuffledAnswers = ref<string[]>([]);
const boost = ref(true);
let rocketTimer: ReturnType<typeof setInterval> | null = null;

const currentQ = computed(() => questions[currentQuestion.value]);

const shuffleAnswers = () => {
  if (currentQ.value) {
    const answers = [currentQ.value.correctAnswer, currentQ.value.wrongAnswer];
    const shuffled = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    shuffledAnswers.value = shuffled;
  }
};

// ⭐ NEW: multiplier for star background speed
const starSpeedMultiplier = ref(1);

onMounted(() => {
  shuffleAnswers();

  // Initialize stars
  const newStars: Star[] = [];
  for (let i = 0; i < 80; i++) {
    newStars.push({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.1,
    });
  }
  stars.value = newStars;

  // Animate stars
  const animateStars = () => {
    stars.value = stars.value.map((star) => ({
      ...star,
      y: star.y + star.speed * starSpeedMultiplier.value > 100
        ? -5
        : star.y + star.speed * starSpeedMultiplier.value,
    }));
    requestAnimationFrame(animateStars);
  };

  if (gameState.value === 'playing' || gameState.value === 'menu') {
    requestAnimationFrame(animateStars);
  }
  startRocketTimer();
});

onUnmounted(() => {
  stopRocketTimer();
});

const startRocketTimer = () => {
  rocketTimer = setInterval(() => {
    if (gameState.value === 'playing') {
      const elapsedTime = Date.now() - lastAnswerTime.value;

      if (elapsedTime > 4000) {
        rocketHeight.value = Math.max(rocketHeight.value - 3, 0);
      } else {
        rocketHeight.value = Math.max(rocketHeight.value - 0.8, 0);
      }

      if (rocketHeight.value === 0) {
        gameState.value = 'gameOver';
        stopRocketTimer();
      }
    }
  }, 100);
};

const stopRocketTimer = () => {
  if (rocketTimer !== null) {
    clearInterval(rocketTimer);
    rocketTimer = null;
  }
};

const handleAnswer = (selectedAnswer: string) => {
  if (gameState.value !== 'playing') return;

  lastAnswerTime.value = Date.now();

  const isCorrect = selectedAnswer === currentQ.value.correctAnswer;

  if (isCorrect) {
    score.value++;
    showFeedback.value = 'correct';
    rocketHeight.value = Math.min(rocketHeight.value + 40, 85);

    // ⭐ Speed up stars temporarily
    starSpeedMultiplier.value = 5; // give a burst of speed
    boost.value = false;
    // After 1 second, return back to normal
    setTimeout(() => {
      starSpeedMultiplier.value = 1;
      boost.value = true;
    }, 1000);

    setTimeout(() => {
      showFeedback.value = null;
      if (currentQuestion.value === questions.length - 1) {
        gameState.value = 'victory';
      } else {
        currentQuestion.value++;
        shuffleAnswers();
      }
    }, 1000);
  } else {
    lives.value--;
    showFeedback.value = 'wrong';

    // ⭐ Optional: slow down stars on wrong answer
    starSpeedMultiplier.value = Math.max(starSpeedMultiplier.value - 0.2, 1);

    setTimeout(() => {
      showFeedback.value = null;
      if (lives.value === 0) {
        gameState.value = 'gameOver';
      } else if (currentQuestion.value === questions.length - 1) {
        gameState.value = 'victory';
      } else {
        currentQuestion.value++;
        shuffleAnswers();
      }
    }, 1000);
  }
};

const resetGame = () => {
  stopRocketTimer();
  currentQuestion.value = 0;
  score.value = 0;
  lives.value = 3;
  rocketHeight.value = 35;
  gameState.value = 'playing';
  showFeedback.value = null;
  lastAnswerTime.value = Date.now();
  rocketTimer = null;
  starSpeedMultiplier.value = 1; // ⭐ reset speed
  startRocketTimer();
  shuffleAnswers();
};

const startGame = () => {
  gameState.value = 'playing';
  resetGame();
};

const togglePause = () => {
  gameState.value = gameState.value === 'paused' ? 'playing' : 'paused';
};

</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 relative overflow-hidden border-6 border-ternary rounded-xl">
    

    <!-- Stars -->
    <div v-for="star in stars" :key="star.id" class="absolute bg-white rounded-full opacity-60"
      :style="{ left: `${star.x}%`, top: `${star.y}%`, width: `${star.size}px`, height: `${star.size}px` }"></div>

    <!-- Game Header -->
    <div class="relative z-10 flex justify-between items-center p-4">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="sm" @click="togglePause" class="text-white hover:bg-slate-700">
          <Play v-if="gameState === 'paused'" class="w-4 h-4" />
          <Pause v-else class="w-4 h-4" />
        </Button>
        <span class="text-2xl font-bold text-white">{{ score }}</span>
      </div>

      <div class="flex gap-1">
        <Heart v-for="i in 3" :key="i" class="w-6 h-6"
          :class="i <= lives ? 'text-red-500 fill-red-500' : 'text-slate-600'" />
      </div>
    </div>

    <!-- Progress Bar -->
    <ProgressBar :progress="currentQuestion * 10" />

    <div v-if="gameState === 'playing' && !showFeedback">
      <!-- Question Display -->
      <div class="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 class="text-4xl font-bold text-white mb-2">{{ currentQ?.word }}</h1>
        <p class="text-slate-300 text-sm">
          Question {{ currentQuestion + 1 }} of {{ questions.length }}
        </p>
      </div>

      <!-- Answer Buttons -->

      <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 space-y-4 w-full max-w-md px-4">
        <Button v-for="(answer, index) in shuffledAnswers" :key="`${currentQuestion}-${index}`"
          @click="handleAnswer(answer)"
          class="w-full h-16 text-lg font-semibold bg-slate-700/50 hover:bg-slate-600 text-white border-2 border-slate-500 hover:border-slate-400 transition-all duration-200"
          size="lg">
          {{ answer }}
        </Button>
      </div>
    </div>

    <div v-else-if="gameState === 'menu'">
      

      <div class="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 text-center">
        <h1 class="text-4xl font-bold text-white mb-2">Rocket Password Game</h1>
        <p class="text-slate-300 text-sm">
          Your goal is to pick a strong password between two options.
        </p>
      </div>
      
      <div class="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 space-y-4 w-full max-w-md px-4">
        <Button @click="startGame"
          class="w-full h-16 text-lg font-semibold bg-green-600/50 hover:bg-green-700 text-white border-2 border-green-500 hover:border-green-400 transition-all duration-200"
          size="lg">
          PLAY
        </Button>
      </div>
    </div>
    <!-- Rocket -->
    <div class="absolute left-1/2 transform -translate-x-1/2 z-0 transition-all duration-1000 ease-out"
      :style="{ bottom: `${Math.max(0, rocketHeight)}%` }">
      <div class="size-50"><Rocket :boost="boost" /></div>
    </div>


    <!-- Feedback Display -->
    <div v-if="showFeedback" class="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10">
      <div class="text-6xl text-center" :class="showFeedback === 'correct' ? 'animate-bounce' : 'animate-pulse'">
        {{ showFeedback === 'correct' ? '✅' : '❌' }}
      </div>
      <p class="text-center text-xl font-bold mt-2"
        :class="showFeedback === 'correct' ? 'text-green-400' : 'text-red-400'">
        {{ showFeedback === 'correct' ? 'Correct!' : 'Wrong!' }}
      </p>
    </div>

    <!-- Game Over/Victory Screen -->
    <div v-if="gameState === 'gameOver' || gameState === 'victory'"
      class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-30">
      <Card class="w-full max-w-md p-8 text-center space-y-6 bg-slate-800 text-white border-slate-600">
        <div>
          <h2 class="text-3xl font-bold mb-2">
            {{ gameState === 'victory' ? '🎉 Victory!' : '💥 Game Over' }}
          </h2>
          <p class="text-slate-300">
            {{ gameState === 'victory' ? 'Congratulations! You reached the top!' : 'Better luck next time!' }}
          </p>
        </div>

        <div class="space-y-2">
          <p class="text-lg">
            Final Score: <span class="font-bold text-green-400">{{ score }}</span>
          </p>
          <p class="text-sm text-slate-400">
            {{ score }} out of {{ questions.length }} questions correct
          </p>
        </div>

        <Button @click="resetGame" class="w-full" size="lg">
          Play Again
        </Button>
      </Card>
    </div>

    <!-- Pause Screen -->
    <div v-if="gameState === 'paused'"
      class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
      <div class="text-white text-center">
        <h2 class="text-3xl font-bold mb-4">Game Paused</h2>
        <p class="text-slate-300">Press the pause button to continue</p>
      </div>
    </div>
  </div>
</template>