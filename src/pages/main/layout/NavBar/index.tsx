import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, withRouter } from 'react-router-dom';

import Auctions from './Auctions';
import Wallet from './Wallet';

const NavBar = () => (
  <Switch>
    <Route path='/running' component={Auctions} />
    <Route path='/scheduled' component={Auctions} />
    <Route path='/ended' component={Auctions} />
    {/* <Route path='/wallet' component={Wallet} /> */}
  </Switch>
);

export default withRouter(connect()(NavBar));
