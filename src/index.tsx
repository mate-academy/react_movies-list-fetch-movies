import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import { App } from './App';
import { GlobalProvider } from './Store';

createRoot(document.getElementById('root') as HTMLElement).render(
  <GlobalProvider>
    <App />
  </GlobalProvider>,
);
