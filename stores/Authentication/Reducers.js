/**
 * Reducers specify how the application's state changes in response to actions sent to the store.
 *
 * @see https://redux.js.org/basics/reducers
 */

import { createReducer } from 'reduxsauce';
import { INITIAL_STATE } from './InitialState';
import { AuthenticationTypes } from './Actions';

export const setAccountData = (state, action) => ({
  ...state,
  authenticated: true,
  user: action?.user,
});

export const resetAccountData = () => INITIAL_STATE;

/**
 * @see https://github.com/infinitered/reduxsauce#createreducer
 */
export const reducer = createReducer(INITIAL_STATE, {
  [AuthenticationTypes.SET_ACCOUNT_DATA]: setAccountData,
  [AuthenticationTypes.RESET_ACCOUNT_DATA]: resetAccountData,
});
