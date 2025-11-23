/// <reference types="chrome" />
/// <reference types="svelte" />
/// <reference types="vite/client" />

declare module '*.json' {
  const value: any;
  export default value;
}

declare module '*?inline' {
  const content: string;
  export default content;
}