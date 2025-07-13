<script setup lang="ts">
import LearningContent from '../UI/Learning/LearningContent.vue'
import LearningHeader from '../UI/Learning/LearningHeader.vue'
import LearningBody from '../UI/Learning/LearningBody.vue'
import QuestionProgress from '../UI/Question/QuestionProgress.vue'
import QuestionCard from '../UI/Question/QuestionCard.vue'
import LearningSectionUI from '../UI/Learning/LearningSection.vue'
import LearningHeaderUI from '../UI/Learning/LearningHeader.vue'
import LearningBodyUI from '../UI/Learning/LearningBody.vue'
import LearningSpan from '../UI/Learning/LearningSpan.vue'
import LearningQuote from '../UI/Learning/LearningQuote.vue'
import LearningList from '../UI/Learning/LearningList.vue'
import LearningImage from '../UI/Learning/LearningImage.vue'
import LearningImageBanner from '../UI/Learning/LearningImageBanner.vue'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { ref } from 'vue'


const principles = ref([
  "Authority: People are more likely to comply with a request if it comes from someone they perceive as an authority figure.",
  "Scarcity: The fear of missing out on a limited-time offer can pressure people into making hasty decisions.",
  "Urgency: Creating a sense of urgency (e.g., 'your account will be deleted in 24 hours') prompts immediate action without thinking.",
  "Likability/Rapport: Attackers often try to build a friendly rapport or pretend to be someone you know and trust.",
  "Social Proof: People tend to do what others are doing. Scammers might claim that 'many others' have already taken advantage of an offer.",
  "Reciprocation: If someone gives you something for free, you might feel obligated to give something back in return."
]);

</script>

<template>
  <LearningContent>

    <LearningImageBanner />

    <LearningSectionUI>
      <LearningHeaderUI>
        <i>Who</i> Creates Phishing Scams?
      </LearningHeaderUI>
      <LearningBodyUI>
        Phishing scams are <LearningSpan>created</LearningSpan> by cybercriminals looking for financial gain, individual
        hackers showcasing their
        skills, bad actors trying to engage others for <LearningSpan>political</LearningSpan> gain or even disgruntled
        students and/or employees.
      </LearningBodyUI>
    </LearningSectionUI>

    <Accordion type="single" collapsible class="w-xl">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Social Engineering?</AccordionTrigger>
        <AccordionContent>
          Social engineering is a manipulation technique that exploits human error to gain private information.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-2">
        <AccordionTrigger>What is Phishing?</AccordionTrigger>
        <AccordionContent>
          Phishing is a type of social engineering where attackers trick users into revealing personal information.
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="item-3">
        <AccordionTrigger>How can I protect myself?</AccordionTrigger>
        <AccordionContent>
          Be skeptical of unsolicited messages, verify links before clicking, and use multi-factor authentication.
        </AccordionContent>
      </AccordionItem>
    </Accordion>

    <LearningQuote>
      Phishing scams are often created by individuals or groups with malicious intent, seeking to exploit
      vulnerabilities for personal gain.
    </LearningQuote>

    <LearningSectionUI>
      <LearningHeaderUI>
        <i>Who</i> Creates Phishing Scams?
      </LearningHeaderUI>
      <LearningBodyUI>
        Phishing scams are <LearningSpan>created</LearningSpan> by cybercriminals looking for financial gain, individual
        hackers showcasing their
        skills, bad actors trying to engage others for <LearningSpan>political</LearningSpan> gain or even disgruntled
        students and/or employees.
      </LearningBodyUI>
      <LearningList :items="principles" />
    </LearningSectionUI>

  </LearningContent>



  <QuestionProgress />
  <QuestionCard />
  <QuestionCard />
  <QuestionCard />

  <div class="mb-10">
    
  </div>
</template>