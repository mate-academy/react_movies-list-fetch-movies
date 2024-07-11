import React from 'react';
import { createRoot } from 'react-dom/client';
import 'bulma/css/bulma.css';
import { App } from './App';

createRoot(document.getElementById('root') as HTMLElement).render(<App />);
