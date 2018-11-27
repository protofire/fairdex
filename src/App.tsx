import React from 'react';
import { hot } from 'react-hot-loader';

import GlobalStyles from './components/GlobalStyles';
import HomePage from './pages/home';

const App = () => (
  <>
    <HomePage />
    <GlobalStyles />
  </>
);

export default hot(module)(App);
