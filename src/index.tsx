import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';
import { App } from './App';
import { MovieProvider } from './components/Store/Store';

ReactDOM.render(
  <MovieProvider>
    <App />
  </MovieProvider>,
  document.getElementById('root'),
);
