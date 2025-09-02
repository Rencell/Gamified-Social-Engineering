export interface TwoImage {
    Question: string;
    image1: string;
    image2: string;
    answer?: 'image1' | 'image2';
    explanation: string
}