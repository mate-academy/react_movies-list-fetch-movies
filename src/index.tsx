import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import { App } from './App';
import { MoviesProvider } from './components/MoviesContext';

createRoot(document.getElementById('root') as HTMLElement).render(
  <MoviesProvider>
    <App />
  </MoviesProvider>,
);
