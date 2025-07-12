<script setup lang="ts">
import LearningContent from '../UI/Learning/LearningContent.vue'
import LearningImage from '../UI/Learning/LearningImage.vue'
import LearningHeader from '../UI/Learning/LearningHeader.vue'
import LearningBody from '../UI/Learning/LearningBody.vue'
import Citation from '../UI/Learning/Citation.vue'


</script>


<template>
  <LearningContent>
    <LearningBody>
      Ever thought about how hackers break into systems? While many imagine complex code and green and black on screens,
      one of
      the most effective methods is surprisingly simple. It's called <strong>Social engineering</strong>, and it
      targets people, not computers. Social engineers exploit human psychology to gain access to sensitive information.
      The
      way it is effective is because they will attempt to convice you to perform certain actions by impersonation
      a reliable party like a bank or collegue from your work.
    </LearningBody>

    <LearningImage image="https://images5.alphacoders.com/134/1349437.png" source="colcampus.com" />

    <LearningHeader>How can you become a victim?</LearningHeader>

    <LearningBody>
      Social engineers are extremely good at manipulating people. They extract information from social media, receipts,
      and can cause a lot of damage. They can trick you into giving away your passwords, personal information, or even
      money. They can do this through phishing emails, fake websites, or even phone calls that seem legitimate.
    </LearningBody>

    <LearningBody>
      If you are someone who frequently shares personal information online, you might be at risk. Social
      engineers can use this information to create convincing scams that target you specifically.
    </LearningBody>

    <LearningHeader>How relevant is Social engineering?</LearningHeader>

    <LearningBody>
      Many say that Cybercriminals do not need to hack into your computer to steal your information. Modern security
      technologies like antivirus software, firewalls, and two-factor authentication are robust enough to protect
      against
      most cyber threats. Instead, they can simply ask you for it.
    </LearningBody>

    <LearningBody>
      Statistically saying, 98% of cyber attacks involve some form of social engineering. This means that even with the
      best security measures in place, if you fall for a social engineering attack, your data can still be compromised.
      
      <Citation word="(Indusface, 2025)" citation-link="https://www.indusface.com/learning/what-is-a-social-engineering-attack/" />
    </LearningBody>

  </LearningContent>
</template>
