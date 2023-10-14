import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';
import { AppContext } from './Contexts/Contexs';

ReactDOM.render(
  <AppContext>
    <App />
  </AppContext>,
  document.getElementById('root'),
);
