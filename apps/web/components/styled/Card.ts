import styled from 'styled-components';

export const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
`;

export const CardHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f5f5f5;
`;

export const CardTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const CardDescription = styled.p`
  font-size: 14px;
  color: #666;
  margin: 8px 0 0 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const CardContent = styled.div`
  color: #333;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const SectionTitle = styled.h4`
  font-size: 12px;
  font-weight: bold;
  color: #666;
  margin: 16px 0 16px 0;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const SettingItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;

  &:last-child {
    border-bottom: none;
  }
`;

export const SettingLeft = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

export const SettingTextContainer = styled.div`
  margin-left: 16px;
  flex: 1;
`;

export const SettingTitle = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
  margin-bottom: 2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;

export const SettingDescription = styled.div`
  font-size: 14px;
  color: #666;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
`;



