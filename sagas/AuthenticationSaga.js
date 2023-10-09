/* eslint-disable no-unused-vars */
import { takeLatest, all, put, call } from 'redux-saga/effects';
import AuthenticationActions, { AuthenticationTypes } from 'stores/Authentication/Actions';
import ThemeActions from 'stores/Theme/Actions';
import Cookies from 'utils/Cookies';
import jwt from 'jsonwebtoken';
import AuthService from 'services/AuthService';

function* fetchUser() {
  try {
    const token = localStorage.getItem('token');
    const user = jwt.decode(token);
    if (user) {
      yield put(AuthenticationActions.setAccountData(user));
    }
  } catch (error) {
    console.error(error);
  }
}

function* logoutUser() {
  try {
    // const user = yield call(AuthService.logout);

    // if (user) {
    yield call(Cookies.clearData);
    // yield call(localStorage.clear());
    yield put(AuthenticationActions.resetAccountData());
    yield put(ThemeActions.resetTheme());
    // localStorage.clear();
    window.location.href = '/auth/sign-in';
    // }
  } catch (error) {
    console.error(error);
  }
}

export default function* watcher() {
  yield all([
    takeLatest(AuthenticationTypes.FETCH_USER, fetchUser),
    takeLatest(AuthenticationTypes.LOGOUT_USER, logoutUser),
  ]);
}
