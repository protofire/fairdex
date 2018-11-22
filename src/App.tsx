import React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import GlobalStyles from './components/GlobalStyles';

const HomePage = Loadable({
  loader: () => import('./pages/home'),
  loading: () => <h3>Loading...</h3>
});

const MainPage = Loadable({
  loader: () => import('./pages/main'),
  loading: () => <h3>Loading...</h3>
});

const App = () => (
  <>
    <Router>
      <Switch>
        <Route path='/auctions' component={MainPage} />
        <Route path='/' exact={true} component={HomePage} />
        <Redirect to='/' />
      </Switch>
    </Router>
    <GlobalStyles />
  </>
);

export default hot(module)(App);
