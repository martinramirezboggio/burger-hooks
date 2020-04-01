import { put } from 'redux-saga/effects';
import * as actions from '../actions/index';
import axios from "axios";

export function* initIngredientsSaga() {
  try {
    const response = yield axios.get('https://burger-7427e.firebaseio.com/ingredients.json')
    yield put(actions.setIngredients(response.data));
  }catch (error) {
    yield put(actions.fetchIngredientsFailed());
  }
}
