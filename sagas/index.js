import { fork } from 'redux-saga/effects';

import AuthenticationSaga from './AuthenticationSaga';

export default function* root() {
  yield fork(AuthenticationSaga);
}
