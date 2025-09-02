<template>
    <LearningContent>
        <LearningSection>
            
            <LearningHeader>Learn to spot Phishing Tactics</LearningHeader>
            <LearningBody>
                <DescriptionList :data="descriptionData" />
            </LearningBody>
        </LearningSection>
    </LearningContent>
</template>

<script setup lang="ts">
import LearningBody from '../../UI/Learning/Core/LearningBody.vue';
import LearningContent from '../../UI/Learning/Core/LearningContent.vue';
import LearningSection from '../../UI/Learning/Core/LearningSection.vue';
import LearningHeader from '../../UI/Learning/Core/LearningHeader.vue';
import type { DescriptionData } from '../../UI/Learning/Listing/type';
import DescriptionList from '../../UI/Learning/Listing/description-list.vue'
// @ts-ignore
import { images } from '/public/Learning/Content/phishing/WhatIsPhishing/content3/index.ts'

const descriptionData: DescriptionData[] = [
    {
        heading: 'Sense of Urgency',
        subheading: 'You have 24 hours or your account will be locked',
        image: images.icons.timer,
        description: 'Most phishing attacks try to give sense of urgency to victim, seemingly time-sensitive calls to action. The aim is to make victim feel as if they’re missing out on an urgent offer or reward, or nervous about the threat of punishment.',
        examples: [
            {
                example: 'Your account will be locked if you do not update your information within 24 hours.',
                image: images.examples.senseUrgency.example1
            },
            {
                example: 'Your account will be locked if you do not update your information within 24 hours.',
                image: images.examples.senseUrgency.example2
            },
        ],
        signs: [
            'Urgent words such as "Now", "Hurry", "This last for minutes", "Immediately".',
            'Usage of password change or bank because it will put pressure on the victim.',
        ]
    },
    {
        heading: 'Good-to-be-true Rewards',
        subheading: 'Congrats! You’re rich! (Or maybe not...)',
        image: images.icons.fireworks,
        description: 'Phishing scams entice victims with good to be true offers like large cash prizes, or amazing perks. The aim is to trick victims to provide personal information or to click malicious links making them believe they have won a huge reward that requires immediate action to claim.',
        examples: [
            {
                example: 'Scammers will often use fake gift cards or grand prizes claiming that the victim won the exclusive reward. This will urge the victim to click a link to claim exploiting their excitement.',
                image: images.examples.goodToBeTrue.example1
            },
            {
                example: 'Sometimes scammer may claim you won a free vacation package or a free trip to a luxury destination but unfortunately, clicking a link to claim the prize, they may be asked to provide personal details leading to fraud.',
                image: images.examples.goodToBeTrue.example2
            }
        ],
        signs: [
            'You receive a prize notification even without signing up for anything.',
            'The message pressure you to act faster or you will lose the reward.',
        ]
    },
    {
        heading: 'Poor spelling and grammar',
        subheading: 'Yuo lucky winner! Act fast bfore expire!',
        image: images.icons.newspaper,
        description: 'Scams or any fraudulent messages often contain poor spelling, grammatical errors or unusual phrasings which is a result of lack of credibility. Unlike scammers, legitimate sources avoid such errors and usually maintain clear and professional communication.',
        examples: [
            {
                example: 'Scammers will often send emails or text messages with poor spelling and grammar, such as "Your acount has been compromised! Pls verify imediately to restore access."',
                image: images.examples.grammarSpelling.example1
            },
            {
                example: '`Sometimes, attackers will use a fake bank alert that says "Dear valued costumer, your acount has been suspended. Click linbk to restore acess." to steal your personal bank details.`',
                image: images.examples.grammarSpelling.example2
            }
        ],
        signs: [
            'Messages include words that are spelled wrongly and with awkward grammar.',
            'Often associated with malicious links with an attempt to steal your personal information or to commit fraud.',
        ]
    },
    {
        heading: 'Common greetings',
        subheading: 'Did you just call me Sir, and not in my name?!',
        image: images.icons.professional,
        description: 'Scam messages often use generic or impersonal greetings such as "Greetings, person" or "Dear customer" to target broad audience. On the other hand, legitimate sources address you by your full name.',
        examples: [
            {
                example: 'You can often see this in emails or text messages, such as "Dear customer, your account has unusual activity."',
                image: images.examples.commonGreeting.example1
            },
        ],
        signs: [
            'Use common greetings like "Dear customer" or "Hello user" instead of addressing you by your name.',
            'Often paired by a sense of urgency to push you into taking immediate action.',
        ]
    },
    {
        heading: 'Different Link',
        subheading: 'facebook.help.com seems legit to me hmm...',
        image: images.icons.link,
        description: 'Scammers will use misleading links that appear legitimate but will redirect victims to a fake website to steal login credentials, bank details, or to install malicious software on the victim\'s device. These links will copy trusted sources while using unusual subdomains to trick the victims.',
        examples: [
            {
                example: 'Scammers will often send you emails or text messages with deceptive links that appears to be legitimate such as "Dear customer, your bank account is on hold. Please visit secure-metrobank-update.com to reactivate." whereas legitimate banks do not use unofficial subdomains.',
                image: images.examples.differentLink.example1
            },
            {
                example: 'Congratulations! You’ve won a P10,000 SM gift voucher. Claim it at sm-rewards-phil.com." (Real SM Website: www.smsupermalls.com ) Sometimes, scammer will send phishing links that will redirect you to fake login pages or payment requests.',
                image: images.examples.differentLink.example2
            },
        ],
        signs: [
            'There is a slight misspellings or extra characters like "gcash-support.net" where it should only be "gcash.com".',
            'Scam links may use unusual or suspicious domains such as ".xyz" or "-verify.net"',
            'Scammers may also use shortened urls like bit.ly or tinyurl to hide the real website and to trick victims into clicking the link.',
        ]
    },
    {
        heading: 'Unusual Request',
        subheading: 'facebook.help.com seems legit to me hmm...',
        image: images.icons.key,
        description: 'Scam attackers will impersonate trusted people or sources to make unusual or strange requests. Sometimes it will ask you for urgent money transfers, sensitive information or to click unusual links like document links that may lead to fraudulent acts. These type of scams rely on sense of urgency or secrecy to pressure victims on fulfilling the requests.',
        examples: [
            {
                example: 'Scammers will impersonate a trusted contact and will share an email with a random document in which once clicked may lead to stealing your login credentials or install malicious software on your device.',
                image: images.examples.unusualRequest.example1
            },
            {
                example: 'It is mostly used in bank transactions wherein they will trick victim with the request with an attempt to steal personal information and bank details.',
                image: images.examples.unusualRequest.example2
            },
        ],
        signs: [
            'Usually comes from an unknown sender or account.',
            'Asking for personal information, One Time Password (OTP), or bank details that legitimate sources don`t request.',
           
        ]
    },
    {
        heading: 'Suspicious Attachment',
        subheading: 'facebook.help.com seems legit to me hmm...',
        image: images.icons.document,
        description: 'These are attachments sent via email or text messages that may contain malicious software or viruses that are harmful to your device. They may be music, videos, documents, or links designed to steal user information or hack the device.',
        examples: [
            {
                example: 'Scammers may send an attached music file designed to trick victim into downloading the harmful content.',
                image: images.examples.suspiciousAttachment.example1
            },
            {
                example: 'Sometimes suspicious attachments rely on sense of urgency to trick victim to open it to install malware or to steal information.',
                image: images.examples.suspiciousAttachment.example2
            },
        ],
        signs: [
            'They sometime disguise as document file such as file.docx or media file like sound.mp3',
            'May include dangerous file extensions such as .exe, .bat, .zip, or .scr.',
           
        ]
    },

];

</script>