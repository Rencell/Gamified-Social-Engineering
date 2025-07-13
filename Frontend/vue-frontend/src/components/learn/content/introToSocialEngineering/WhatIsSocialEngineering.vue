<script setup lang="ts">
import LearningImage from '../UI/Learning/LearningImage.vue'
import Citation from '../UI/Learning/Citation.vue'
import LearningSection from '../UI/Learning/LearningSection.vue'
import LearningHeader from '../UI/Learning/LearningHeader.vue'
import LearningBody from '../UI/Learning/LearningBody.vue'
import LearningContent from '../UI/Learning/LearningContent.vue'
import LearningSpan from '../UI/Learning/LearningSpan.vue'
import LearningQuote from '../UI/Learning/LearningQuote.vue'
</script>


<template>
  <LearningContent>

    <LearningImage image="https://images5.alphacoders.com/134/1349437.png" source="colcampus.com" />

    <LearningSection>
      <LearningHeader>Basically...</LearningHeader>
      <LearningBody>
        Ever thought about how hackers break into systems? While many imagine complex code and green and black on
        screens,
        one of the most effective methods is surprisingly simple. It's called
        <LearningSpan>Social engineering</LearningSpan>, and it targets people, not computers.
        Social engineers exploit <LearningSpan>human psychology</LearningSpan> to gain access to
        <LearningSpan>sensitive information</LearningSpan>. The way it is effective is because they will attempt to
        <LearningSpan>convince you to perform certain actions</LearningSpan> by impersonation
        a reliable party like a <LearningSpan>bank</LearningSpan> or <LearningSpan>colleague from your work
        </LearningSpan>.
      </LearningBody>

    </LearningSection>


    <LearningQuote>
      "Social engineering is the art of manipulating people so they give up confidential information."
    </LearningQuote>

    <LearningSection>
      <LearningHeader><i>Why</i> is this important?</LearningHeader>
      <LearningBody>
        <LearningSpan>Social engineers</LearningSpan> are extremely good at <LearningSpan>manipulating people
        </LearningSpan>.
        They extract information from <LearningSpan>social media</LearningSpan>, <LearningSpan>receipts</LearningSpan>,
        and can cause a lot of damage. They can trick you into giving away your
        <LearningSpan>passwords</LearningSpan>, <LearningSpan>personal information</LearningSpan>, or even
        <LearningSpan>money</LearningSpan>. They can do this through <LearningSpan>phishing emails</LearningSpan>,
        <LearningSpan>fake websites</LearningSpan>, or even <LearningSpan>phone calls that seem legitimate
        </LearningSpan>.
      </LearningBody>

      <LearningBody>
        If you are someone who frequently shares <LearningSpan>personal information online</LearningSpan>,
        you might be at risk. <LearningSpan>Social engineers</LearningSpan> can use this information to create
        <LearningSpan>convincing scams</LearningSpan> that <LearningSpan>target you specifically</LearningSpan>.
      </LearningBody>

    </LearningSection>

    <LearningQuote>
      Statistically says, 98% of cyber attacks involve some form of social engineering. <Citation word="(Indusface, 2025)" citation-link="https://www.indusface.com/learning/what-is-a-social-engineering-attack/" />
    </LearningQuote>
    <!-- 


    <LearningHeader>How relevant is Social engineering?</LearningHeader>

    <LearningBody>
      Many say that Cybercriminals do not need to hack into your computer to steal your information. Modern security
      technologies like antivirus software, firewalls, and two-factor authentication are robust enough to protect
      against
      most cyber threats. Instead, they can simply ask you for it.
    </LearningBody>

    <LearningBody>
       
      
      
    </LearningBody>  -->

  </LearningContent>
</template>
