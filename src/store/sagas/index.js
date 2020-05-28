import { takeEvery, all, takeLatest } from 'redux-saga/effects';
import { logoutSaga, checkAuthTimeoutSaga, authUserSaga, checkStateSaga } from "./authenticate";
import { initIngredientsSaga } from "./burgerBuilder";
import { purchaseBurgerSaga, fetchOrdersSaga } from "./order";
import * as actionTypes from '../actions/actionTypes';

// all  <--- you can use when doing a double axios call
// Authentication Sagas
export function* watchAuth() {
  yield all([
    takeEvery(actionTypes.AUTH_INITIATE_LOGOUT, logoutSaga),
    takeEvery(actionTypes.AUTH_CHECK_TIMEOUT, checkAuthTimeoutSaga),
    takeEvery(actionTypes.AUTH_USER, authUserSaga),
    takeEvery(actionTypes.AUTH_CHECK_STATE, checkStateSaga)
  ]);
}

// Burger Sagas
export function* watchBurger() {
  yield takeEvery(actionTypes.INIT_INGREDIENTS, initIngredientsSaga);
}


//takeLatest  <---- takes the last call action
export function* watchOrders() {
 yield takeLatest(actionTypes.FETCH_ORDERS,fetchOrdersSaga);
 yield takeEvery(actionTypes.PURCHASE_BURGER,purchaseBurgerSaga);
}
