/* eslint-disable no-console */
import { takeLatest, all, put, call } from 'redux-saga/effects';
import AuthenticationActions, { AuthenticationTypes } from 'stores/Authentication/Actions';
import ThemeActions from 'stores/Theme/Actions';
import Cookies from 'utils/Cookies';
import { parseJwt } from 'utils/Utils';
import AuthService from 'services/AuthService';

function* fetchUser() {
  try {
    const token = Cookies.getData('accessToken');
    const user = parseJwt(token);

    if (user) {
      yield put(AuthenticationActions.setAccountData(user));
    }
  } catch (error) {
    console.error(error);
  }
}

function* logoutUser() {
  window.location.href = '/auth/sign-in';

  // try {
  //   const user = yield call(AuthService.logout);

  //   if (user) {
  //     yield call(Cookies.clearData);
  //     yield put(AuthenticationActions.resetAccountData());
  //     yield put(ThemeActions.resetTheme());
  //     localStorage.clear();
  //     window.location.href = '/auth/sign-in';

  //   }
  // } catch (error) {
  //   console.error(error);
  // }
}

export default function* watcher() {
  yield all([
    takeLatest(AuthenticationTypes.FETCH_USER, fetchUser),
    takeLatest(AuthenticationTypes.LOGOUT_USER, logoutUser),
  ]);
}
