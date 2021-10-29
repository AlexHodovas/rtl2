import { call, put, takeLatest, fork, takeEvery } from "redux-saga/effects";
import { actionTypes, actions, defaultState } from "../index";
const axios = require("axios");
const fetchUsers = () => axios.get("http://localhost:3001/users");

function* workerSagaGetUsers() {
  try {
    const { data } = yield call(fetchUsers);
    yield put(actions.getUsersSuccess(data));
  } catch (error) {
    console.log("error in workerSagaGetUsers", error);
    yield put(actions.getUsersSuccess([]));
  }
}

function* watcherSagaGetUsers() {
  yield takeLatest(actionTypes.GET_USERS, workerSagaGetUsers);
}

function* workerSagaResetState() {
  yield put(actions.resetStateSuccess(defaultState));
}

function* watcherSagaResetState() {
  yield takeEvery(actionTypes.RESET_STATE, workerSagaResetState);
}

export default function* rootSaga() {
  yield fork(watcherSagaGetUsers);
  yield fork(watcherSagaResetState);
}