import styled from 'styled-components';
import React, { createContext, useContext, useState } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export const Tabs = styled.div`
  width: 100%;
`;

export const TabsList = styled.div`
  display: flex;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 20px;
`;

export const TabsTrigger = styled.button<{ $isActive: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  background: ${props => props.$isActive ? '#ffffff' : 'transparent'};
  color: ${props => props.$isActive ? '#2E86AB' : '#666'};
  border-radius: 8px;
  font-weight: ${props => props.$isActive ? '600' : '500'};
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;

  &:hover {
    background: ${props => props.$isActive ? '#ffffff' : 'rgba(46, 134, 171, 0.1)'};
  }
`;

export const TabsContent = styled.div<{ $isActive: boolean }>`
  display: ${props => props.$isActive ? 'block' : 'none'};
`;

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
}

export const TabsProvider: React.FC<TabsProps> = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <Tabs>{children}</Tabs>
    </TabsContext.Provider>
  );
};

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export const TabsTriggerComponent: React.FC<TabsTriggerProps> = ({ value, children }) => {
  const { activeTab, setActiveTab } = useTabsContext();
  
  return (
    <TabsTrigger 
      $isActive={activeTab === value}
      onClick={() => setActiveTab(value)}
    >
      {children}
    </TabsTrigger>
  );
};

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export const TabsContentComponent: React.FC<TabsContentProps> = ({ value, children }) => {
  const { activeTab } = useTabsContext();
  
  return (
    <TabsContent $isActive={activeTab === value}>
      {children}
    </TabsContent>
  );
};



