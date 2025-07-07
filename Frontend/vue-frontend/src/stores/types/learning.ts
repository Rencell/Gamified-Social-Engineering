export interface Module {
    title: string;
    component: object; // Vue component
    interactive?: boolean;
  }
  
  export interface Lesson {
    id: string; // e.g., 'phishing', 'password-security'
    title: string;
    description: string;
    modules: Module[];
  }