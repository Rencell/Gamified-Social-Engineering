<script setup lang="ts">
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { AlertTriangle } from 'lucide-vue-next';
import { Input } from '../ui/input';

const isOpen = ref(false);
const isChecked = ref(false);
function toggleDialog() {
    isOpen.value = !isOpen.value;
    emit('sendEmit');
}

function handleCheckboxChange() {
    isChecked.value = !isChecked.value;
}

const emit = defineEmits(['sendEmit']);

</script>

<template>


    <Dialog :show-for-user="true">
        <DialogTrigger>
            <Button size="lg">Start New Simulation?</Button>
        </DialogTrigger>
        <DialogContent class="max-h-[80vh] overflow-y-auto scroll-hidden">
            <DialogHeader>
                <DialogTitle>Phishing Simulation Consent Required</DialogTitle>
                <DialogDescription>
                    Before proceeding, please read and understand the following information about our phishing
                    simulation program.
                </DialogDescription>

                <div class="space-y-4 my-6">
                    <Card class="bg-orange-500/10 border-orange-500/30 border-2 text-white flex bprder-2">
                        <CardContent class="text-gray-200 font-semibold text-sm flex gap-5">
                            <AlertTriangle class="h-9 w-9 text-orange-500 " />
                            <div>
                                <strong class="text-white">Important Notice:</strong> 
                                <div>
                                    By participating in this
                                    simulation, you
                                    acknowledge and consent to the following:
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div class="bg-[#1a1d2e] rounded-lg p-6 space-y-4 border border-[#2a2d3e]">
                        <div class="flex gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-[#3b4a8c] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">1</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-white mb-1">Email Usage Authorization</h4>
                                <p class="text-gray-400 text-sm">
                                    Your email address will be used to send simulated phishing emails designed to test
                                    your security
                                    awareness. These emails will mimic real phishing attempts.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-[#3b4a8c] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">2</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-white mb-1">Training Purpose Only</h4>
                                <p class="text-gray-400 text-sm">
                                    All simulated emails are for educational purposes only. No actual malicious content
                                    will be sent,
                                    and your data remains secure throughout the process.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-[#3b4a8c] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">3</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-white mb-1">Performance Tracking</h4>
                                <p class="text-gray-400 text-sm">
                                    Your interactions with simulation emails (opens, clicks, submissions) will be
                                    tracked and recorded
                                    to measure your security awareness progress.
                                </p>
                            </div>
                        </div>

                        <div class="flex gap-3">
                            <div
                                class="w-6 h-6 rounded-full bg-[#3b4a8c] flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span class="text-white text-xs font-bold">4</span>
                            </div>
                            <div>
                                <h4 class="font-semibold text-white mb-1">Voluntary Participation</h4>
                                <p class="text-gray-400 text-sm">
                                    Participation is voluntary. You may opt out at any time by contacting your
                                    administrator or through
                                    your account settings.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="flex items-start gap-3 p-4 bg-[#1a1d2e] rounded-lg border border-[#2a2d3e]">
                        <Checkbox v-model="isChecked" @change="handleCheckboxChange"  />

                        <label htmlFor="consent" class="text-sm text-gray-300 leading-relaxed cursor-pointer">
                            I have read and understood the above information. I consent to participate in phishing
                            simulation
                            training and authorize the use of my email address for this educational purpose.
                        </label>
                    </div>
                    <div v-if="isChecked" class="flex flex-col items-start gap-3 p-4 bg-[#1a1d2e] rounded-lg border border-[#2a2d3e]">
                        <label for="" class="text-xs">Phone Number:</label>
                        <Input placeholder="Enter your phone number"></Input>
                    </div>


                </div>
            </DialogHeader>
            <DialogFooter>
                <Button variant="outline" >Decline</Button>
                <Button :disabled="!isChecked" @click="toggleDialog">Accept & Continue</Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>


<style scoped>
.scroll-hidden {
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
    scrollbar-width: none;
    /* Firefox, Safari 18.2+, Chromium 121+ */
}

.scroll-hidden::-webkit-scrollbar {
    display: none;
    /* Older Safari and Chromium */
}
</style>