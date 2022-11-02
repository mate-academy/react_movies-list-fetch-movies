import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';
import { AppProvider } from './components/AppProvider';

ReactDOM.render(
  <AppProvider>
    <App />
  </AppProvider>,
  document.getElementById('root'),
);
