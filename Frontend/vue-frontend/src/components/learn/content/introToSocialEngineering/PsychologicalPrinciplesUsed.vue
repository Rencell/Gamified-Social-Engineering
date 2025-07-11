<script setup lang="ts">
import LearningContent from '../UI/Learning/LearningContent.vue'
import LearningHeader from '../UI/Learning/LearningHeader.vue'
import LearningBody from '../UI/Learning/LearningBody.vue'
import QuestionProgress from '../UI/Question/QuestionProgress.vue'
import QuestionCard from '../UI/Question/QuestionCard.vue'
</script>

<template>
  <LearningContent>
    <LearningHeader>Psychological Principles Used in Social Engineering</LearningHeader>

    <LearningBody>
      Social engineers are masters of manipulation, and they use a variety of psychological principles to trick their
      victims. Understanding these principles is the first step to defending yourself against them.
    </LearningBody>

    <LearningHeader>1. Authority</LearningHeader>
    <LearningBody>
      People tend to obey authority figures. Social engineers often impersonate individuals in positions of power,
      such as IT support, law enforcement, or senior management, to gain compliance. For example, an attacker might
      pretend to be from the IT department and demand your password to fix a critical issue.
    </LearningBody>

    <LearningHeader>2. Scarcity</LearningHeader>
    <LearningBody>
      Opportunities seem more valuable when their availability is limited. Social engineers create a sense of urgency
      to pressure victims into immediate action. For example, an email stating, "Your account will be suspended in 24
      hours if you don't click this link!" creates a sense of urgency.
    </LearningBody>

    <LearningHeader>3. Liking</LearningHeader>
    <LearningBody>
      People are more likely to be persuaded by those they like. Social engineers often build rapport with their
      targets by finding common interests or offering compliments. For example, a new "friend" on social media who
      shares many mutual connections might subtly try to extract personal information.
    </LearningBody>

    <LearningHeader>4. Consistency and Commitment</LearningHeader>
    <LearningBody>
      Once people commit to something, they are more likely to stick with it. Social engineers often start with small,
      seemingly harmless requests and gradually escalate them. For example, an attacker might first ask for a small
      piece of non-sensitive information and then follow up with a larger request.
    </LearningBody>

    <LearningHeader>5. Reciprocity</LearningHeader>
    <LearningBody>
      People feel obligated to return favors. Social engineers might offer something seemingly valuable, like a free
      download, before asking for something in return. For example, receiving an unsolicited "gift" from someone who
      then asks for sensitive information.
    </LearningBody>

    <LearningHeader>6. Social Proof (Consensus)</LearningHeader>
    <LearningBody>
      People tend to follow the actions of others. Social engineers might claim that "everyone else is doing it" or
      show fake testimonials to convince targets. For example, a phishing email designed to look like it's from a
      widely used service, implying that many users are updating their information.
    </LearningBody>
  </LearningContent>

  <QuestionProgress />
  <QuestionCard />
</template>