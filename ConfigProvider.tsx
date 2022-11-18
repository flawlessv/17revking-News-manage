import React from 'react';
import { ConfigProvider, Button } from 'antd';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
    <Button />
  </ConfigProvider>
);

export default App;