const React = require('react');

const createStyledComponent = (tag) => {
  const StyledComponent = React.forwardRef((props, ref) => {
    // Filtrer les props qui ne doivent pas être passées au DOM
    const filteredProps = { ...props };
    
    // Liste des props à filtrer par défaut
    const propsToFilter = ['$isOpen', '$type', 'isPositive', 'color'];
    
    propsToFilter.forEach(prop => {
      if (prop in filteredProps) {
        delete filteredProps[prop];
      }
    });
    
    // Filtrer aussi les props qui commencent par $
    Object.keys(filteredProps).forEach(key => {
      if (key.startsWith('$')) {
        delete filteredProps[key];
      }
    });
    
    return React.createElement(tag, { ...filteredProps, ref });
  });
  
  // Ajouter la méthode withConfig
  StyledComponent.withConfig = (config) => {
    const NewComponent = React.forwardRef((props, ref) => {
      const filteredProps = { ...props };
      
      // Utiliser shouldForwardProp si fourni dans la config
      if (config && config.shouldForwardProp) {
        Object.keys(props).forEach(key => {
          if (!config.shouldForwardProp(key)) {
            delete filteredProps[key];
          }
        });
      } else {
        // Filtrage par défaut
        const propsToFilter = ['$isOpen', '$type', 'isPositive', 'color', 'isOpen'];
        propsToFilter.forEach(prop => {
          if (prop in filteredProps) {
            delete filteredProps[prop];
          }
        });
        
        Object.keys(filteredProps).forEach(key => {
          if (key.startsWith('$')) {
            delete filteredProps[key];
          }
        });
      }
      
      return React.createElement(tag, { ...filteredProps, ref });
    });
    
    NewComponent.withConfig = (newConfig) => NewComponent;
    return NewComponent;
  };
  
  return StyledComponent;
};

const mockStyledComponents = createStyledComponent;

// Mock pour tous les éléments HTML courants
const styled = new Proxy(() => {}, {
  get: (target, prop) => {
    if (typeof prop === 'string') {
      const styledComponent = createStyledComponent(prop);
      
      // Retourner une fonction qui peut être appelée avec template literals
      const templateFunction = (strs, ...vals) => styledComponent;
      
      // Ajouter withConfig à la fonction template
      templateFunction.withConfig = (config) => {
        const componentWithConfig = createStyledComponent(prop);
        componentWithConfig.withConfig = (newConfig) => componentWithConfig;
        return (strs, ...vals) => componentWithConfig;
      };
      
      return templateFunction;
    }
    return target[prop];
  }
});

// Mock pour ThemeProvider
const ThemeProvider = ({ children }) => children;

module.exports = {
  __esModule: true,
  default: styled,
  ThemeProvider,
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
  })
};