"use client";
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
  }

  html,
  body {
    max-width: 100vw;
    overflow-x: hidden;
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: #ffffff;
    color: var(--color-black);
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }

  a {
    color: var(--link-color);
    font-size: 0.95em;
  }

  :root {
    --primary-color: #F5A623;
    --primary-hover: #e5941a;
    --secondary-color: #F5F1EA;
    --text-primary: #23190C;
    --text-secondary: #6b4e1e;
    --text-muted: #bfae99;
    --border-color: #f0e8dd;
    --border-hover: #e5d8c3;
    --background: #FCFAF7;
    --background-secondary: #F5F1EA;
    --success: #10b981;
    --error: #ef4444;
    --warning: #f59e0b;
    --info: #3b82f6;
    --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07);
    --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.07);
    --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.07);
    --radius: 0.5rem;
    --radius-sm: 0.25rem;
    --radius-lg: 0.75rem;
    --input-bg: #F5F1EA;
    --link-color: #B97A1A;
    --color-black: #171412;
    --color-white: #FFFFFF;
    --color-taupe: #827869;
    --color-gray-light: #E3E0DE;
    --color-gray-lighter: #E5E8EB;
    --color-gray-bg: #F5F2F2;
    --color-beige: #EDD9BF;
  }

  [data-theme="dark"] {
    --primary-color: #F5A623;
    --primary-hover: #e5941a;
    --secondary-color: #2d2212;
    --text-primary: #FCFAF7;
    --text-secondary: #e5d8c3;
    --text-muted: #bfae99;
    --border-color: #4b3a1a;
    --border-hover: #6b4e1e;
    --background: #23190C;
    --background-secondary: #2d2212;
  }

  .btn-primary {
    background-color: var(--primary-color);
    color: white;
    font-weight: 600;
    border-radius: 8px;
    font-size: 1rem;
    border: none;
    transition: background 0.2s;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-hover);
  }

  .input {
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 8px;
    font-size: 1rem;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    transition: border 0.2s;
  }
  .input:focus {
    border: 1.5px solid var(--primary-color);
    outline: none;
  }
`; 