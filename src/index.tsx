import ReactDOM from 'react-dom';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import 'bulma/css/bulma.css';
import { App } from './App';

const queryClient = new QueryClient();

ReactDOM.render((
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
), document.getElementById('root'));
