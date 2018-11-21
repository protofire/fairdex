import React from 'react';
import { hot } from 'react-hot-loader';
import Loadable from 'react-loadable';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';

import GlobalStyles from './common/GlobalStyles';

const LandingPage = Loadable({
  loader: () => import('./landing'),
  loading: () => <h3>Loading...</h3>
});

const MainPage = Loadable({
  loader: () => import('./main'),
  loading: () => <h3>Loading...</h3>
});

const App = () => (
  <>
    <Router>
      <Switch>
        <Route path='/auctions' component={MainPage} />
        <Route path='/' exact={true} component={LandingPage} />
        <Redirect to='/' />
      </Switch>
    </Router>
    <GlobalStyles />
  </>
);

export default hot(module)(App);
