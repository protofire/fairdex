import { applyMiddleware, createStore, Middleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

import rootReducer from './reducer';

const composeEnhancers = composeWithDevTools({
  serialize: true,
});

const middlewares: Middleware[] = [thunk];

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger({ collapsed: true });

  middlewares.push(logger);
}

export default createStore(
  rootReducer,
  // initialState,
  composeEnhancers(applyMiddleware(...middlewares)),
);
