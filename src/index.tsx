import React from 'react';
import { render } from 'react-dom';
import { Provider as StateProvider } from 'react-redux';

import App from './App';
import store from './store';

const AppBundle = (
  <StateProvider store={store}>
    <App />
  </StateProvider>
);

render(AppBundle, document.getElementById('root'));
