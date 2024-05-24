import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import { App } from './App';
// eslint-disable-next-line max-len
import { MovieContextProvider } from './components/MovieContext/MovieContextProvider';

createRoot(document.getElementById('root') as HTMLElement).render(
  <MovieContextProvider>
    <App />
  </MovieContextProvider>,
);
