import ReactGA from 'react-ga';
ReactGA.initialize('UA-133450500-2');
import createBrowserHistory from 'history/createBrowserHistory'; // tslint:disable-line

import React, { ComponentProps, ComponentType } from 'react';

const history = createBrowserHistory();
// history.listen(location => {
//   ReactGA.pageview(location.pathname)
//   console.log(location.pathname)
// });

const pageview = ReactGA.pageview;

const withPageview = <P extends ComponentProps<any>>(pathname: string = '/', Component: ComponentType<P>) => {
  class WithPageview extends React.Component<P> {
    componentDidMount() {
      ReactGA.pageview(pathname);
    }

    render() {
      return <Component {...this.props} />;
    }
  }
  return WithPageview;
};

export { history, withPageview, pageview };
