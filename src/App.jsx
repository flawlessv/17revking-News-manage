import './App.less';
import { useRoutes } from 'react-router-dom';
import routes from './router/index'
import { ConfigProvider } from 'antd';
function App() {
  const element = useRoutes(routes)
  return (
    <ConfigProvider
      csp={{ nonce: 'YourNonceCode' }}
      theme={{
        token: {
          colorPrimary: '#FF5F95',
          fontFamily: 'serif'
        },
      }}
    >
      {element}
    </ConfigProvider>
  );
}
export default App;
