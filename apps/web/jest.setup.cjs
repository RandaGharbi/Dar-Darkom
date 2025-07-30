require('@testing-library/jest-dom');

// Mock pour styled-components 
jest.mock('styled-components', () => {
  const React = require('react');
  
  const styled = new Proxy({}, {
    get: (target, prop) => {
      return () => React.forwardRef((props, ref) => {
        // Filter out transient props (starting with $)
        const filteredProps = Object.keys(props).reduce((acc, key) => {
          if (!key.startsWith('$')) {
            acc[key] = props[key];
          }
          return acc;
        }, {});
        return React.createElement(prop, { ...filteredProps, ref });
      });
    }
  });

  return {
    __esModule: true,
    default: styled,
    ThemeProvider: ({ children }) => children,
    createGlobalStyle: () => () => null,
    keyframes: (strings, ...interpolations) => {
      // Mock keyframes function
      return `keyframes_${Math.random().toString(36).substr(2, 9)}`;
    },
    css: (strings, ...interpolations) => {
      // Mock css function
      return `css_${Math.random().toString(36).substr(2, 9)}`;
    },
    ServerStyleSheet: function() {
      return {
        instance: {},
        collectStyles: (children) => children,
        getStyleTags: () => '',
        getStyleElement: () => null,
        seal: () => {},
      };
    },
    StyleSheetManager: ({ children }) => children,
    useTheme: () => ({
      colors: {
        text: { primary: '#000', secondary: '#666', muted: '#999' },
        sidebar: { background: '#fff', border: '#e5e7eb' },
        background: '#fff',
        border: '#e5e7eb',
        surface: '#f9fafb',
        card: { background: '#fff' }
      },
      borderRadius: { sm: '4px', md: '8px', full: '50%' },
      shadows: { sm: '0 1px 2px rgba(0,0,0,0.1)', lg: '0 4px 12px rgba(0,0,0,0.15)' }
    }),
  };
});

// Mock pour next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock global ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(() => null),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// S'assurer que localStorage est disponible globalement
global.localStorage = localStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock pour lib/api
jest.mock('./lib/api');

// Mock pour services/notificationService  
jest.mock('./services/notificationService');

