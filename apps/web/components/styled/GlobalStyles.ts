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
    /* Couleurs principales inspirées du mobile */
    --primary-color: #2E86AB;
    --primary-hover: #256a8a;
    --primary-light: #f0f8ff;
    --secondary-color: #f8f9fa;
    --text-primary: #333;
    --text-secondary: #666;
    --text-muted: #999;
    --border-color: #f5f5f5;
    --border-hover: #e5e5e5;
    --background: #f8f9fa;
    --background-secondary: #ffffff;
    --success: #10b981;
    --error: #ef4444;
    --warning: #f59e0b;
    --info: #2E86AB;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 8px 16px 0 rgba(0, 0, 0, 0.1);
    --radius: 12px;
    --radius-sm: 8px;
    --radius-lg: 16px;
    --input-bg: #f0f8ff;
    --link-color: #2E86AB;
    --color-black: #333;
    --color-white: #FFFFFF;
    --color-gray-light: #f5f5f5;
    --color-gray-lighter: #f8f9fa;
    --color-gray-bg: #f8f9fa;
    --color-blue: #2E86AB;
    --color-blue-light: #f0f8ff;
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
    border-radius: var(--radius);
    font-size: 16px;
    border: none;
    padding: 16px;
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    box-shadow: var(--shadow);
    cursor: pointer;
  }
  .btn-primary:hover:not(:disabled) {
    background-color: var(--primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
  .btn-primary:active:not(:disabled) {
    transform: translateY(0);
  }

  .input {
    background: var(--input-bg);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: var(--radius);
    font-size: 16px;
    padding: 16px;
    margin-bottom: 16px;
    transition: all 0.2s;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  }
  .input:focus {
    border: 1px solid var(--primary-color);
    outline: none;
    box-shadow: 0 0 0 3px rgba(46, 134, 171, 0.1);
  }
  .input::placeholder {
    color: var(--text-secondary);
    opacity: 1;
  }
`; 