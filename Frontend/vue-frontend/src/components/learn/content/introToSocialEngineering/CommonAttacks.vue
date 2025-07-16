<template>
  <div class="p-6 min-h-screen">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Common Social Engineering Attacks</h1>
    <p class="mb-8 text-lg text-gray-600">
      Social engineers use a variety of techniques to manipulate people. Here are some of the most common attacks to watch out for.
    </p>

    <Accordion type="single" class="w-full" collapsible default-value="'item-1'">
      <AccordionItem v-for="(attack, index) in attacks" :key="index" :value="`item-${index + 1}`" class="border-b">
        <AccordionTrigger class="text-xl font-semibold hover:bg-gray-800 py-4">
          {{ attack.title }}
        </AccordionTrigger>
        <AccordionContent class="p-4 bg-secondary">
          <p class="text-gray-700 mb-4">{{ attack.description }}</p>
          <div class="p-4 border-l-4 border-blue-500 bg-background/80">
            <p class="font-semibold text-blue-800">Example:</p>
            <p class="text-blue-700">{{ attack.example }}</p>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </div>
</template>

<script setup lang="ts">
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const attacks = [
  {
    title: 'Phishing',
    description: 'Phishing attacks use fraudulent emails, messages, or websites disguised as legitimate ones to trick individuals into revealing sensitive information like passwords, credit card numbers, or personal data.',
    example: 'You receive an email that appears to be from your bank, asking you to click a link and verify your account details due to a "security alert." The link leads to a fake website that captures your login credentials.'
  },
  {
    title: 'Pretexting',
    description: 'In pretexting, an attacker invents a fabricated scenario (the pretext) to gain a victims trust and persuade them to provide access to sensitive information or systems.',
    example: 'An attacker calls an employee pretending to be from the IT department. They claim they need the employees password to perform a critical system update, thereby gaining unauthorized access.'
  },
  {
    title: 'Baiting',
    description: 'Baiting involves luring victims into a trap by offering something enticing. The bait can be physical, like a malware-infected USB drive left in a public place, or digital, like a tempting free movie download.',
    example: 'An employee finds a USB drive labeled "Executive Salaries" in the office parking lot. Curious, they plug it into their work computer, which then installs malicious software.'
  },
  {
    title: 'Quid Pro Quo',
    description: 'Meaning "something for something," this type of attack involves promising a benefit in exchange for information. The benefit is usually something that seems minor or reasonable to the victim.',
    example: 'An attacker calls random numbers at a company, claiming to be from technical support. Eventually, they find someone with a real IT problem and offer to "help" in exchange for the user disabling their antivirus software, allowing the attacker to install malware.'
  },
  {
    title: 'Tailgating (or Piggybacking)',
    description: 'Tailgating is a physical security breach where an unauthorized person follows an authorized individual into a restricted area. The attacker often pretends to be a delivery person or an employee who forgot their ID card.',
    example: 'An attacker waits by a secure office entrance. When an employee opens the door with their keycard, the attacker asks them to hold the door, gaining access to the building without credentials.'
  }
];
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
