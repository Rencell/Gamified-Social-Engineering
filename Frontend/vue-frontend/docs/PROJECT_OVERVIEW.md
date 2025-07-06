# Project Overview: Scenario-Based Social Engineering Awareness

This project is a web application designed to educate users about social engineering attacks through interactive, scenario-based learning modules. The application is built with Vue.js and utilizes a component-based architecture for a modular and scalable design.

## Key Technologies

*   **Frontend Framework:** Vue.js 3
*   **State Management:** Pinia
*   **Routing:** Vue Router
*   **Styling:** Tailwind CSS
*   **Build Tool:** Vite
*   **Language:** TypeScript

## Project Structure

The project follows a standard Vue.js project structure, with the following key directories:

*   `src/assets`: Contains static assets such as images and CSS files.
*   `src/components`: Contains reusable UI components that are used throughout the application. These are the building blocks of the application's user interface.
*   `src/router`: Defines the application's routes and maps them to the corresponding views.
*   `src/stores`: Contains the application's Pinia stores, which are used for state management.
*   `src/views`: Contains the application's pages, which are composed of one or more components.

## Learning Modules

The core of the application is the scenario-based learning modules. These modules are designed to simulate real-world social engineering attacks and allow users to make choices and see the consequences of their actions.

The modules are organized by topic (e.g., "Phishing") and are located in the `src/views/learn` directory. Each module is a Vue component that presents a scenario to the user and guides them through a series of decision points.

## Gamification and Engagement

The application incorporates gamification elements to enhance user engagement and motivation. These features include:

*   **Scoring and Rewards:** Users are awarded points and badges for making secure choices and completing modules.
*   **Leaderboards:** A leaderboard system fosters friendly competition and allows users to compare their performance with others.
*   **Progress Tracking:** A user dashboard provides a visual representation of progress, completed modules, and earned rewards.

## Development Plan

The project is being developed in phases, with the following key milestones:

1.  **Core Functionality:** Develop the scenario engine, user interaction, and initial content modules.
2.  **Gamification and Engagement:** Implement scoring, rewards, leaderboards, and progress tracking.
3.  **Content Expansion and Refinement:** Create advanced scenarios, allow for customization, and implement feedback and reporting.
4.  **Deployment and Maintenance:** Deploy the application to a production environment and provide ongoing maintenance and support.
