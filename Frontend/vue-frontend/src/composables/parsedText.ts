export function parseText(inputText: string) {
    if (!inputText) return [];

    const parts = inputText.split(/(\*\*.*?\*\*)/g); // Split by **content**
    return parts.map((part) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2); // Remove the ** from the text
            return { type: 'span', content };
        }
        return { type: 'text', content: part };
    });
}