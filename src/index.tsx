import ReactDOM from 'react-dom';
import React from 'react';

import 'bulma/css/bulma.css';
import { App } from './App';
import { GlobalContextProvider } from './management/GlobalContextProvider';

ReactDOM.render(
  <GlobalContextProvider>
    <App />
  </GlobalContextProvider>, document.getElementById('root'),
);
