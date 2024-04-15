import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import { App } from './App';
import { MovieProvider } from './components/MovieProvider';

createRoot(document.getElementById('root') as HTMLElement).render(
  <MovieProvider>
    <App />
  </MovieProvider>,
);
