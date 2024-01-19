import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';
import { GlobalProvider } from './State/State';

ReactDOM.render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
  document.getElementById('root'),
);
