import 'styled-components';
import { lightTheme } from '../context/ThemeContext';

type Theme = typeof lightTheme;

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
} 