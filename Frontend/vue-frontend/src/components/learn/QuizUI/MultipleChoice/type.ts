import type { Component } from "vue";

export interface MultipleChoice {
    image: string
    question: string
    options: Array<{
        id: string;
        text: string;
    }>;
    correctAnswer: string
    explanation: string
    moduleExplanation: Component
}

// Example fake data for testing purposes
// (Replace `null` with actual Vue components as needed)
// export const fakeQuestions: Question[] = [
//     {
//         image: "https://example.com/image1.jpg",
//         question: "What is the capital of France?",
//         options: [
//             { id: "a", text: "Berlin" },
//             { id: "b", text: "Madrid" },
//             { id: "c", text: "Paris" },
//             { id: "d", text: "Rome" }
//         ],
//         correctAnswer: "c",
//         explanation: "Paris is the capital of France.",
//         moduleExplanation: null as unknown as Component // Replace with actual component
//     },
//     {
//         image: "https://example.com/image2.jpg",
//         question: "Which planet is known as the Red Planet?",
//         options: [
//             { id: "a", text: "Earth" },
//             { id: "b", text: "Mars" },
//             { id: "c", text: "Jupiter" },
//             { id: "d", text: "Saturn" }
//         ],
//         correctAnswer: "b",
//         explanation: "Mars is often called the Red Planet.",
//         moduleExplanation: null as unknown as Component // Replace with actual component
//     }
// ];


