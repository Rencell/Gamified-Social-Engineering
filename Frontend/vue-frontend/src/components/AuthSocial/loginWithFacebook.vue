
<script setup lang="ts">
import FacebookLogin from "vue-facebook-login-component-next";
import { useAuthStore } from "@/stores/auth";

import { useRoute, useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
function handleLogin(response: any) {
  console.log("Facebook response:", response);

  if (response?.authResponse?.accessToken) {
    const accessToken = response.authResponse.accessToken;
    useAuthStore().loginWithFacebook(accessToken, router, route);
  }
}

</script>


<template>
  <FacebookLogin
    app-id="4078247095767508"
    @login="handleLogin"></FacebookLogin>
</template>