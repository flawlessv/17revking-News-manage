import './App.less';
import { useRoutes } from 'react-router-dom';
import routes from './router/index'
import { Fragment } from 'react';
function App() {
  const element=useRoutes(routes)
  return (
    <Fragment>
      {element}
    </Fragment>
  );
}
export default App;
