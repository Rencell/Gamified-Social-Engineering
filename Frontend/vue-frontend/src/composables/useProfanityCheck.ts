import { ref, computed } from 'vue';
import { Filter } from 'bad-words';

export function useProfanityCheck() {
  const filter = new Filter();
  const flaggedContent = ref('');
  const isProfane = ref(false);

  const checkProfanity = (text: string): boolean => {
    // Check with the standard filter (word boundaries)
    const hasProfanityExact = filter.isProfane(text);
    
    // Also check for substring matches to catch variations like "fuckl", "shitt", etc.
    const lowerText = text.toLowerCase();
    const commonProfanities = [
      'fuck', 'shit', 'ass', 'bitch', 'damn', 'hell', 'crap', 'piss',
      'whore', 'slut', 'bastard', 'dick', 'pussy', 'cock', 'cunt',
      'motherfuck', 'asshole', 'dumbass', 'retard', 'faggot'
    ];
    
    const hasSubstringProfanity = commonProfanities.some(word => 
      lowerText.includes(word)
    );
    
    const hasProfanity = hasProfanityExact || hasSubstringProfanity;
    isProfane.value = hasProfanity;
    
    if (hasProfanity) {
      flaggedContent.value = text;
    }
    
    return hasProfanity;
  };

  const filterProfanity = (text: string): string => {
    return filter.clean(text);
  };

  const addProfanityWords = (words: string[]): void => {
    filter.addWords(...words);
  };

  const removeProfanityWords = (words: string[]): void => {
    filter.removeWords(...words);
  };

  const clearFlag = () => {
    isProfane.value = false;
    flaggedContent.value = '';
  };

  return {
    checkProfanity,
    filterProfanity,
    addProfanityWords,
    removeProfanityWords,
    isProfane: computed(() => isProfane.value),
    flaggedContent: computed(() => flaggedContent.value),
    clearFlag,
  };
}
