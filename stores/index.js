import { combineReducers } from 'redux';
import rootSaga from 'sagas';
import configureStore from './CreateStore';

import { reducer as AuthenticationReducer } from './Authentication/Reducers';
import { reducer as ThemeReducer } from './Theme/Reducers';

const stores = () => {
  const rootReducer = combineReducers({
    /**
     * Register your reducers here.
     * @see https://redux.js.org/api-reference/combinereducers
     */
    auth: AuthenticationReducer,
    theme: ThemeReducer,
  });

  return configureStore(rootReducer, rootSaga);
};

export default stores;
