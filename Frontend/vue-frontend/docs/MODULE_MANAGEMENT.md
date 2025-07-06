# Module Management Strategy

This document clarifies the distinction between `views` and `components` and provides a strategy for managing modules in this project.

## `components` vs. `views`

- **`components`**: These are the building blocks of your application. They are reusable UI elements that can be used in multiple places. Examples in this project include `Button.vue`, `ModuleCard.vue`, `ModuleSidebar.vue`, and `ModuleContent.vue`. Think of them as custom HTML elements that you can use throughout your application.

- **`views`**: These are the pages of your application. They are typically mapped to routes in your `router/index.ts` file. A view is composed of one or more components. For example, the `Learn.vue` view might use the `ModuleList.vue` component to display a list of modules.

## How to Manage Modules

In the context of this project, a "module" is a specific lesson or scenario that a user can navigate to. Therefore, the content of a module should be a **view**.

Here's the recommended approach:

1.  **Module Content (as Views):** The actual content of each module should be a `.vue` file in the `src/views/learn/[lecture]/` directory. For example, the "Email Phishing" module for the "Phishing" lecture would be located at `src/views/learn/phishing/EmailPhishing.vue`.

2.  **Reusable Module Components:** The reusable components that make up the module pages (e.g., `ModuleLayout.vue`, `ModuleSidebar.vue`, `ModuleContent.vue`) should be located in the `src/components/learn/` directory.

## Example

Let's say you want to create a new module called "Spear Phishing" for the "Phishing" lecture.

1.  **Create the view:** Create a new file at `src/views/learn/phishing/SpearPhishing.vue`. This file will contain the specific content for the "Spear Phishing" lesson.

2.  **Compose the view:** Inside `SpearPhishing.vue`, you will use the reusable module components from `src/components/learn/` to build the page. For example:

    ```vue
    <template>
      <ModuleLayout>
        <ModuleSidebar :active-module="'Spear Phishing'" />
        <ModuleContent title="Spear Phishing">
          <!-- Your lesson content goes here -->
        </ModuleContent>
      </ModuleLayout>
    </template>
    ```

3.  **Add a route:** In `src/router/index.ts`, you would add a new route for this module:

    ```typescript
    {
      path: '/learn/phishing/spear-phishing',
      name: 'spear-phishing',
      component: () => import('../views/learn/phishing/SpearPhishing.vue')
    }
    ```

By following this approach, you will keep your project organized and scalable. You'll have a clear separation between the reusable UI components and the specific content of each module.
