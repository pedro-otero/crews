import { createStore, combineReducers } from 'redux';
import generateReducer from '../reducers/generate-reducer';

const store = () => createStore(combineReducers({
  searches: generateReducer('SET_SEARCH_RESULT'),
  albums: generateReducer('SET_ALBUM'),
}));

export default store;
