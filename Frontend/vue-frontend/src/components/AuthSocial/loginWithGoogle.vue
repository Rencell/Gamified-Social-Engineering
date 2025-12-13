<script setup lang="ts">
import { googleTokenLogin } from "vue3-google-login"
import { useAuthStore } from '@/stores/auth';
import { useRouter, useRoute } from 'vue-router';
import { toast } from 'vue-sonner'
import { useLoadingPageStore } from "@/stores/pageLoading";
import { computed } from 'vue';
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const loadingPageStore = useLoadingPageStore();

// Dynamic button label based on username
const buttonLabel = computed(() => {
  const username = authStore?.User?.username;
  return username === 'testuser' ? 'Login with CvSU account' : 'Continue to the app';
});

const login = async () => {
  // If not testuser, skip Google auth and go to /home
  const username = authStore?.User?.username;
  if (username !== 'testuser') {
    router.push('/home');
    return;
  }
  
  try {
    loadingPageStore.startLoading();
    const response = await googleTokenLogin();
    if (!response.access_token) {
      throw new Error("No access_token received");
    }
    // Step 2: Fetch user info from Google API
    const userInfo = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${response.access_token}`,
      },
    }).then(res => res.json());

    // Step 3: Check if email ends with .edu.ph
    if (!userInfo.email || !userInfo.email.endsWith("cvsu.edu.ph")) {
      toast_alert();
      loadingPageStore.stopLoading();
      return;
    }
    
    await authStore.loginWithGoogle(response.access_token, router, route);
    loadingPageStore.stopLoading();
  } catch (error) {
    console.error("Login failed", error);
    loadingPageStore.stopLoading();
  }
};

const toast_alert = () => {
  toast.warning(`Please use your school email (.edu.ph) to log in.`, {
    action: {
      label: 'Close',
      onClick: () => console.log('Closed notification'),
    },
    position: 'top-center',
    duration: 5000,
    style: {
      color: '#ee5253',
    },
  })
}
</script>

<template>
  
  <button @click="login"
    class="border-1 rounded-full p-2 py-3 bg-green-500/50 font-semibold text-sm flex justify-center items-center gap-2 cursor-pointer hover:scale-95 transition-all ">
    <img src="https://upload.wikimedia.org/wikipedia/en/d/d2/Cavite_State_University_%28CvSU%29.png" class="size-6"
      alt="">
    {{ buttonLabel }}
  </button>
</template>
