# Folder Structure Plan

This document outlines the proposed folder structure for the Vue application, focusing on scalability and clarity, especially for the "Learn" section.

## Root `src` Structure

```
src/
|-- assets/
|-- components/
|   |-- core/         // Buttons, Inputs, etc.
|   |-- layout/       // Main layout components (Navbar, Sidebar, Footer)
|   |-- learn/        // Components specific to the learning section
|   |-- achievement/  // Components specific to achievements
|   `-- home/         // Components specific to the home screen
|-- router/
|   `-- index.ts
|-- stores/
|-- views/
|   |-- Home.vue
|   |-- Learn.vue
|   |-- Achievement.vue
|   `-- learn/
|       |-- [lecture]/            // e.g., /phishing, /malware
|       |   |-- index.vue         // Lists all modules for the lecture
|       |   `-- [module].vue      // The actual lesson/scenario content
|       `-- index.vue             // The main "Learn" page, listing all lectures
`-- App.vue
```

## Focus: `/src/views/learn`

This is the core of the learning experience.

### `/src/views/learn/index.vue`

- **Purpose:** This will be the main landing page for the "Learn" tab.
- **Content:** It will display a list of all available lectures (e.g., "Phishing", "Malware", "Physical Security"). Each item will be a link to that specific lecture's page.

### `/src/views/learn/[lecture]/index.vue`

- **Purpose:** This page will display all the modules for a specific lecture. For example, if the lecture is "Phishing", this page will list modules like "Introduction to Social Engineering", "Email Phishing", "Website Phishing", etc.
- **`[lecture]`:** This will be a dynamic route parameter (e.g., `phishing`, `malware`).
- **Content:** It will use the `ModuleList.vue` component to display the modules.

### `/src/views/learn/[lecture]/[module].vue`

- **Purpose:** This is the actual lesson content for a specific module. This is where the user will go through the scenario-based learning.
- **`[module]`:** This will be a dynamic route parameter (e.g., `introduction`, `email-phishing`).
- **Content:** This will use the `ModuleLayout.vue` and its child components (`ModuleSidebar.vue`, `ModuleContent.vue`, etc.) to display the lesson.

## Example Flow:

1.  User clicks on the "Learn" tab, which navigates to `/learn`.
2.  The `src/views/learn/index.vue` component is rendered, showing a list of lectures.
3.  User clicks on the "Phishing" lecture, navigating to `/learn/phishing`.
4.  The `src/views/learn/phishing/index.vue` component is rendered, showing a list of modules for the "Phishing" lecture.
5.  User clicks on the "Email Phishing" module, navigating to `/learn/phishing/email-phishing`.
6.  The `src/views/learn/phishing/email-phishing.vue` component is rendered, which starts the lesson for that module.

This structure will be more organized and scalable as you add more lectures and modules.
