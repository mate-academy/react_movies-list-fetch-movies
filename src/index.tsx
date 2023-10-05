import ReactDOM from 'react-dom';
import 'bulma/css/bulma.css';

import { App } from './App';
import { MoviesContextProvider } from './contexts/MoviesContext';

ReactDOM.render(
  <MoviesContextProvider>
    <App />
  </MoviesContextProvider>,
  document.getElementById('root'),
);
